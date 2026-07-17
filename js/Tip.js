const text = "{ از ایده تا اجرا، کنار شما هستیم. }";
    const typing = document.getElementById("typing");

    let started = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;

      started = true;

      let i = 0;

      function typeWriter() {
        if (i < text.length) {
          typing.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        }
      }

      typeWriter();
    });

    observer.observe(typing);