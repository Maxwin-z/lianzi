const dragger = document.querySelector("#dragger");
let currentWriter = null;
let currentStyle = {};
document.querySelector("#btn_add").addEventListener(
  "click",
  () => {
    const writer = document.createElement("div");
    writer.className = "writer";
    writer.contentEditable = true;
    Object.assign(
      writer.style,
      {
        top: "100px",
        left: "100px"
      },
      currentStyle
    );

    document.body.appendChild(writer);
    bindWriter(writer);
    writer.focus();
  },
  false
);

document.querySelector("#btn_print").addEventListener("click", () => {
  window.print();
});

document.addEventListener("click", event => {
  console.log(event);
  if (event.target === document.body && currentWriter) {
    currentWriter.className = "writer";
    dragger.style.display = "none";
  }
});

function bindWriter(writer) {
  writer.addEventListener("focus", () => {
    if (currentWriter) {
      currentWriter.className = "writer";
    }
    dragger.style.display = "block";
    currentWriter = writer;
    writer.className = "writer current";
    const top = writer.style.top;
    const left = writer.style.left;
    dragger.style.top = parseInt(top) - dragger.clientHeight + "px";
    dragger.style.left = left;
  });
}

const btnMove = document.querySelector("#btn_move");
(function () {
  let dragging = false;
  btnMove.addEventListener(
    "mousedown",
    event => {
      dragging = true;
      document.addEventListener("mousemove", moveHandler, false);
    },
    false
  );
  document.addEventListener("mouseup", () => {
    dragging = false;
    document.removeEventListener("mousemove", moveHandler, false);
  });

  function moveHandler(event) {
    if (dragging) {
      dragger.style.top = parseInt(dragger.style.top) + event.movementY + "px";
      dragger.style.left =
        parseInt(dragger.style.left) + event.movementX + "px";
      currentWriter.style.top =
        parseInt(currentWriter.style.top) + event.movementY + "px";
      currentWriter.style.left =
        parseInt(currentWriter.style.left) + event.movementX + "px";
    }
  }
})();

(function () {
  [...document.querySelectorAll(".btn_modify")].forEach(btn => {
    function modify() {
      const prop = btn.getAttribute("data-style");
      const sign = parseInt(btn.getAttribute("data-sign"));
      let val = parseFloat(getComputedStyle(currentWriter)[prop]) || 0.0;
      currentWriter.style[prop] = currentStyle[prop] = val + sign * 0.1 + "px";
    }

    function longPressedAction() {
      interval = setInterval(modify, 30);
    }

    let timer = null;
    let interval = null;

    btn.addEventListener("click", modify, false);
    btn.addEventListener("mousedown", () => {
      timer = setTimeout(() => {
        longPressedAction();
      });
    });
    document.addEventListener("mouseup", () => {
      clearTimeout(timer);
      clearInterval(interval);
      timer = null;
      interval = null;
    });
  });
})();
