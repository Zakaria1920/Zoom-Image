function imageZoom(imgID, resultContID, resultID) {
  var img,
    lens,
    resultCont,
    result,
    cx,
    cy,
    scale = 1;
  img = document.getElementById(imgID);
  resultCont = document.getElementById(resultContID);
  result = document.getElementById(resultID);
  /* Create lens: */
  lens = document.createElement("DIV");
  lens.setAttribute("class", "img-zoom-lens");
  /* Insert lens: */
  img.parentElement.appendChild(lens);
  /* Calculate the ratio between result DIV and lens: */
  cx = result.offsetWidth / lens.offsetWidth;
  cy = result.offsetHeight / lens.offsetHeight;
  /* Set background properties for the result DIV */
  result.style.backgroundImage = `url("${img.src}")`;
  result.style.backgroundSize = `${img.width * cx}px ${img.height * cy}px`;
  lens.style.backgroundImage = `url("${img.src}")`;
  lens.style.backgroundSize = `${img.width}px ${img.height}px`;
  // Hide lens and result
  lens.addEventListener("mouseleave", () => {
    lens.classList.remove("open");
    resultCont.classList.remove("open");
    removeEventListener("wheel", zoom);
  });
  /* Execute a function when someone moves the cursor over the image, or the lens: */
  lens.addEventListener("mousemove", moveLens);
  img.addEventListener("mousemove", moveLens);
  function moveLens(e) {
    // Show lens and result
    lens.classList.add("open");
    resultCont.classList.add("open");
    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    /* Calculate the position of the lens: */
    x = pos.x - lens.offsetWidth / 2;
    y = pos.y - lens.offsetHeight / 2;
    /* Prevent the lens from being positioned outside the image: */
    if (x > img.width - lens.offsetWidth) {
      x = img.width - lens.offsetWidth;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > img.height - lens.offsetHeight) {
      y = img.height - lens.offsetHeight;
    }
    if (y < 0) {
      y = 0;
    }
    /* Set the position of the lens: */
    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;
    /* Display what the lens "sees": */
    result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
    lens.style.backgroundPosition = `-${x}px -${y}px`;
    // Add wheel event to zoom in result
    window.addEventListener("wheel", zoom);
  }
  function getCursorPos(e) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    a = img.getBoundingClientRect();
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /* Consider any page scrolling: */
    x = x - window.scrollX;
    y = y - window.scrollY;
    return { x: x, y: y };
  }
  function zoom(event) {
    function animation() {
      scale += event.deltaY * -0.001;
      // Restrict scale
      scale = Math.min(Math.max(1, scale), 3);
      // Apply scale transform
      if (scale > 1 && scale < 3) {
        result.style.transform = `scale(${scale})`;
        requestAnimationFrame(animation);
      }
    }
    animation();
  }
}
imageZoom("myimage", "myresultCont", "myresult");
