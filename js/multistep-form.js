/* ==========================================================================
   RK Multi-Step Form — standalone controller
   No dependencies (no jQuery required). Safe to include on any page that
   contains one or more `.rkms` blocks. Each instance is isolated, so the
   same file works for the contact form, the project-request form, etc.

   USAGE
   -----
   1) Auto-init (default):
      <div class="rkms" data-rkms> ... </div>
      <script src="rk-multistep-form.js"></script>
      -> every [data-rkms] on the page is initialized automatically.

   2) Manual init (e.g. to hook up a submit handler):
      const form = new RKMultiStepForm('#my-form', {
        onSubmit: async (data) => {
          // data = { phone, email, company, fullName, subject, description }
          await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        },
      });

   3) Or just point it at an endpoint without writing a handler:
      new RKMultiStepForm('#my-form', { endpoint: '/api/requests' });
   ========================================================================== */

(function (global) {
  'use strict';

  var FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  var AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

  function toEnglishDigits(value) {
    return value.replace(/[۰-۹٠-٩]/g, function (ch) {
      var faIndex = FA_DIGITS.indexOf(ch);
      if (faIndex > -1) return String(faIndex);
      var arIndex = AR_DIGITS.indexOf(ch);
      if (arIndex > -1) return String(arIndex);
      return ch;
    });
  }

  function RKMultiStepForm(root, options) {
    this.root = typeof root === 'string' ? document.querySelector(root) : root;
    if (!this.root) {
      throw new Error('RKMultiStepForm: root element not found for "' + root + '"');
    }
    if (this.root.dataset.rkmsInit === 'true') {
      return this.root._rkmsInstance; // avoid double-init on the same element
    }
    this.root.dataset.rkmsInit = 'true';

    this.options = Object.assign(
      {
        onSubmit: null, // async function(data): Promise
        endpoint: null, // used only if onSubmit is not provided
      },
      options || {}
    );

    this.panels = Array.prototype.slice.call(this.root.querySelectorAll('[data-rkms-panel]'));
    this.steps = Array.prototype.slice.call(this.root.querySelectorAll('[data-rkms-step]'));
    this.track = this.root.querySelector('[data-rkms-track]');
    this.nextBtns = Array.prototype.slice.call(this.root.querySelectorAll('[data-rkms-next]'));
    this.prevBtns = Array.prototype.slice.call(this.root.querySelectorAll('[data-rkms-prev]'));
    this.submitBtn = this.root.querySelector('[data-rkms-submit]');
    this.successPanel = this.root.querySelector('[data-rkms-success]');
    this.errorBox = this.root.querySelector('[data-rkms-error]');
    this.form = this.root.querySelector('form');

    this.current = 0;
    this.total = this.panels.length;

    this._bindEvents();
    this._bindDigitInputs();
    this._render();

    this.root._rkmsInstance = this;
  }

  RKMultiStepForm.prototype._bindEvents = function () {
    var self = this;
    this.nextBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.next();
      });
    });
    this.prevBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.prev();
      });
    });
    if (this.form) {
      this.form.addEventListener('submit', function (e) {
        e.preventDefault();
        self._handleSubmit();
      });
    }
  };

  RKMultiStepForm.prototype._bindDigitInputs = function () {
    var inputs = this.root.querySelectorAll('[data-rkms-digits]');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        var converted = toEnglishDigits(input.value);
        if (converted !== input.value) input.value = converted;
      });
    });
  };

  RKMultiStepForm.prototype._currentPanel = function () {
    return this.panels[this.current];
  };

  RKMultiStepForm.prototype._validateCurrent = function () {
    var panel = this._currentPanel();
    var fields = Array.prototype.slice.call(panel.querySelectorAll('input, textarea, select'));
    var firstInvalid = null;

    fields.forEach(function (field) {
      if (!field.checkValidity() && !firstInvalid) firstInvalid = field;
    });

    panel.classList.toggle('rkms__panel--was-validated', !!firstInvalid);

    if (firstInvalid) {
      firstInvalid.reportValidity();
      firstInvalid.focus();
      return false;
    }
    return true;
  };

  RKMultiStepForm.prototype.next = function () {
    if (!this._validateCurrent()) return;
    if (this.current < this.total - 1) {
      this.current += 1;
      this._render();
    }
  };

  RKMultiStepForm.prototype.prev = function () {
    if (this.current > 0) {
      this.current -= 1;
      this._render();
    }
  };

  RKMultiStepForm.prototype._render = function () {
    var current = this.current;

    this.panels.forEach(function (panel, i) {
      panel.hidden = i !== current;
    });

    this.steps.forEach(function (step, i) {
      step.classList.remove('rkms__step--active', 'rkms__step--done');
      if (i < current) step.classList.add('rkms__step--done');
      else if (i === current) step.classList.add('rkms__step--active');
    });

    if (this.track) {
      var progress = this.total > 1 ? (current / (this.total - 1)) * 75 : 0;
      this.track.style.setProperty('--rkms-progress', progress + '%');
    }
  };

  RKMultiStepForm.prototype._collectData = function () {
    var data = {};
    this.root.querySelectorAll('[name]').forEach(function (field) {
      data[field.name] = field.value.trim();
    });
    return data;
  };

  RKMultiStepForm.prototype._handleSubmit = function () {
    var self = this;
    if (!this._validateCurrent()) return;

    var data = this._collectData();

    if (this.errorBox) this.errorBox.hidden = true;
    if (this.submitBtn) {
      this.submitBtn.disabled = true;
      this.submitBtn.classList.add('rkms__btn--loading');
    }

    var task;
    if (typeof this.options.onSubmit === 'function') {
      task = Promise.resolve(this.options.onSubmit(data));
    } else if (this.options.endpoint) {
      task = fetch(this.options.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed with status ' + res.status);
        return res;
      });
    } else {
      // No handler configured — resolve immediately so the UX still works
      // during development, but warn so it's obvious nothing was sent.
      console.warn('RKMultiStepForm: no onSubmit/endpoint configured, form data was not sent.', data);
      task = Promise.resolve();
    }

    task
      .then(function () {
        self._showSuccess();
        self.root.dispatchEvent(new CustomEvent('rkms:submit', { detail: data }));
      })
      .catch(function (err) {
        self._showError(err);
      })
      .finally(function () {
        if (self.submitBtn) {
          self.submitBtn.disabled = false;
          self.submitBtn.classList.remove('rkms__btn--loading');
        }
      });
  };

  RKMultiStepForm.prototype._showSuccess = function () {
    this.panels.forEach(function (p) {
      p.hidden = true;
    });
    if (this.successPanel) this.successPanel.hidden = false;
    this.steps.forEach(function (step) {
      step.classList.remove('rkms__step--active');
      step.classList.add('rkms__step--done');
    });
    if (this.track) this.track.style.setProperty('--rkms-progress', '100%');
  };

  RKMultiStepForm.prototype._showError = function (err) {
    if (this.errorBox) {
      this.errorBox.hidden = false;
      this.errorBox.textContent = 'ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید.';
    }
    console.error('RKMultiStepForm submit error:', err);
  };

  RKMultiStepForm.prototype.reset = function () {
    if (this.form) this.form.reset();
    this.current = 0;
    if (this.errorBox) this.errorBox.hidden = true;
    if (this.successPanel) this.successPanel.hidden = true;
    this._render();
  };

  function autoInit() {
    document.querySelectorAll('[data-rkms]').forEach(function (el) {
      try {
        // eslint-disable-next-line no-new
        new RKMultiStepForm(el);
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  global.RKMultiStepForm = RKMultiStepForm;
})(window);
