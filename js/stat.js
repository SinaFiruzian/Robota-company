(function () {
      function formatNumber(n) {
        return n.toLocaleString('en-US');
      }

      function animateCount(el) {
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        var duration = 1000;
        var start = null;

        function ease(t) { return 1 - Math.pow(1 - t, 3); }

        function step(ts) {
          if (start === null) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          el.textContent = formatNumber(Math.round(target * ease(progress)));
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = formatNumber(target);
        }
        requestAnimationFrame(step);
      }

      document.querySelectorAll('.metric-cards__count').forEach(animateCount);

      document.querySelectorAll('.metric-cards__bar-fill').forEach(function (bar) {
        var target = bar.getAttribute('data-fill') + '%';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            bar.style.width = target;
          });
        });
      });
    })();