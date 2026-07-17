 const items = document.querySelectorAll(".team-nav-item");
    const indicator = document.getElementById("indicator");

    let order = [0, 1, 2];

    function moveIndicator(element) {
      indicator.style.height = `${element.offsetHeight - 20}px`;
      indicator.style.transform = `translateY(${element.offsetTop + 10}px)`;
    }

    function render() {
      order.forEach((cardIndex, rank) => {
        document.querySelector(
          `.team-card[data-index="${cardIndex}"]`
        ).dataset.rank = rank;
      });
    }

    function bringToFront(cardIndex, button) {

      if (order[0] !== cardIndex) {
        order = [cardIndex, ...order.filter(i => i !== cardIndex)];
        console.log(order);
        render();
      }

      items.forEach(item => item.classList.remove("active"));

      button.classList.add("active");

      moveIndicator(button);
    }

    items.forEach(item => {

      item.addEventListener("click", () => {
        bringToFront(Number(item.dataset.index), item);
      });

    });

    document.querySelectorAll(".team-card").forEach(card => {

      card.addEventListener("click", () => {

        if (card.dataset.rank !== "0") {

          const index = Number(card.dataset.index);

          bringToFront(
            index,
            document.querySelector(`.team-nav-item[data-index="${index}"]`)
          );

        }

      });

    });

    window.addEventListener("load", () => {
      moveIndicator(document.querySelector(".team-nav-item.active"));
    });