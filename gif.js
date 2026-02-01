const radius = 120;
  const centerX = 50;
  const centerY = 50;

  document.querySelectorAll('.menu-item').forEach(el => {
    const angleDeg = parseFloat(el.dataset.angle);
    const angleRad = angleDeg * Math.PI / 180;

    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);

    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
  });

  // Lấy phần tử container
  const gifWrapper = document.getElementById("draggableGif");

// Kiểm tra thiết bị có hỗ trợ cảm ứng
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
  gifWrapper.addEventListener("click", e => {
    // Nếu click vào menu-item thì không toggle
    if (e.target.closest('.menu-item')) return;
    gifWrapper.classList.toggle("active");
  });
}

  // Kéo container
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function getPosition(e) {
    if(e.touches && e.touches.length > 0){
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function startDrag(e){
    e.preventDefault();
    isDragging = true;
    const pos = getPosition(e);
    const rect = gifWrapper.getBoundingClientRect();
    offsetX = pos.x - rect.left;
    offsetY = pos.y - rect.top;
    gifWrapper.classList.add('grabbing');
  }

  function onDrag(e){
    if(!isDragging) return;
    const pos = getPosition(e);
    let left = pos.x - offsetX;
    let top = pos.y - offsetY;

    // Giới hạn vị trí để không kéo ra ngoài màn hình
    const maxLeft = window.innerWidth - gifWrapper.offsetWidth;
    const maxTop = window.innerHeight - gifWrapper.offsetHeight;

    if(left < 0) left = 0;
    if(left > maxLeft) left = maxLeft;
    if(top < 0) top = 0;
    if(top > maxTop) top = maxTop;

    gifWrapper.style.left = left + "px";
    gifWrapper.style.top = top + "px";
    gifWrapper.style.right = "auto";
    gifWrapper.style.transform = "none";
  }

  function endDrag(){
    isDragging = false;
    gifWrapper.classList.remove('grabbing');
  }

  // Sự kiện chuột
  gifWrapper.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", endDrag);

  // Sự kiện cảm ứng
  gifWrapper.addEventListener("touchstart", startDrag, {passive:false});
  document.addEventListener("touchmove", onDrag, {passive:false});
  document.addEventListener("touchend", endDrag);
