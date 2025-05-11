const $inner = $('#header .content .inner');
let transitionEnded = false;

$inner.on('transitionend', function (e) {
  if (!transitionEnded &&
      (e.originalEvent.propertyName === 'opacity' ||
       e.originalEvent.propertyName === 'max-height' ||
       e.originalEvent.propertyName === 'padding')) {

    transitionEnded = true;

    const logoCheckInterval = setInterval(() => {
      const $logo = $('#header .logo');
      if ($logo.length && $logo.is(':visible') && $logo.width() > 0) {
        clearInterval(logoCheckInterval);

        $('.ladybug').css('display', 'block');
        initLadybug();
      }
    }, 200);
  }
});



function initLadybug() {
  const $ladybug = $('.ladybug');
  const $logo = $('#header .logo');
  let moving = false;

  function getLogoCenter() {
    const logoRect = $logo[0].getBoundingClientRect();
    return {
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2,
      width: logoRect.width
    };
  }

  const { width } = getLogoCenter();
  $ladybug.css({
    width: width * 0.7 + 'px'
  });

  function moveToLogoCenter() {
    const { x, y, width } = getLogoCenter();
    const currentLeft = parseFloat($ladybug.css('left'));
    const currentTop = parseFloat($ladybug.css('top'));
    const dx = x - currentLeft;
    const dy = y - currentTop;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    $ladybug.stop(true);
    $ladybug.css('transform', `translate(-50%, -50%) rotate(${angle}deg)`);

    $ladybug.animate({
      left: x,
      top: y
    }, 2000, function () {
      $ladybug.css({
        width: width * 0.7 + 'px',
        transform: 'translate(-50%, -50%) rotate(0deg)'
      });
    });
  }

  function randomMove() {
    if (!moving) return;

    const bugWidth = $ladybug.outerWidth();
    const bugHeight = $ladybug.outerHeight();
    const padding = 20;

    const minX = bugWidth / 2 + padding;
    const maxX = window.innerWidth - bugWidth / 2 - padding;
    const minY = bugHeight / 2 + padding;
    const maxY = window.innerHeight - bugHeight / 2 - padding;

    const targetX = Math.random() * (maxX - minX) + minX;
    const targetY = Math.random() * (maxY - minY) + minY;

    const currentLeft = parseFloat($ladybug.css('left'));
    const currentTop = parseFloat($ladybug.css('top'));
    const dx = targetX - currentLeft;
    const dy = targetY - currentTop;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    $ladybug.css('transform', `translate(-50%, -50%) rotate(${angle}deg)`);

    $ladybug.animate({
      left: targetX,
      top: targetY
    }, 4000, function () {
      if (moving) randomMove();
    });
  }

  $ladybug.on('click', function () {
    moving = !moving;
    if (moving) {
      randomMove();
    } else {
      moveToLogoCenter();
    }
  });

  $(window).on('resize', function () {
    if (!moving) moveToLogoCenter();
  });

  moveToLogoCenter();
}
