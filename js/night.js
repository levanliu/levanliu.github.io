(function () {
    /**
     * Icarus 夜间模式 by iMaeGoo
     * https://www.imaegoo.com/
     */
  
    var isNight = localStorage.getItem('night');
    var nightNav;

    // console.log("IsNight: ", isNight)
  
    function applyNight(value) {
        if (value.toString() === 'true') {
            document.body.classList.remove('light');
            document.body.classList.add('night');
        } else {
            document.body.classList.remove('night');
            document.body.classList.add('light');
        }
        // Assuming Disqus was used as the comment plugin.
        // try {
        //     DISQUS.reset({ reload: true });
        // } catch (error) {
        //     console.error(error);
        //     // expected output: ReferenceError: nonExistentFunction is not defined
        //     // Note - error messages will vary depending on browser
        // }
        if (typeof DISQUS !== "undefined")
        {
            DISQUS.reset({ reload: true });
        }
    }
  
    function findNightNav() {
        nightNav = document.getElementById('night-nav');
        if (!nightNav) {
            setTimeout(findNightNav, 100);
        } else {
            nightNav.addEventListener('click', switchNight);
        }
    }
  
    function switchNight() {
        isNight = isNight ? isNight.toString() !== 'true' : true;
        applyNight(isNight);
        localStorage.setItem('night', isNight);
    }
  
    findNightNav();
    isNight && applyNight(isNight);
  }());