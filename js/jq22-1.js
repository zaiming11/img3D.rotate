(function () {
    window.onerror = function () {
      return true;
    };
    if (
      typeof AudioContext != "undefined" ||
      typeof webkitAudioContext != "undefined"
    ) {
      AudioContext = function () {
        return false;
      };
      webkitAudioContext = function () {
        return false;
      };
    }
    if (typeof mozAudioContext != "undefined") {
      mozAudioContext = function () {
        return false;
      };
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis = {};
    }
    if ("speak" in speechSynthesis) {
      speechSynthesis.speak = function () {
        return false;
      };
    }
    navigator.getUserMedia = function () {};
    navigator.mozGetUserMedia = function () {};
    navigator.webkitGetUserMedia = function () {};
    navigator.mediaDevices.getUserMedia = function () {};
    var __animationDuration = 4000;
    var __animationsTimedOut = false;
    var __animationRequests = [];
    var __requestAnimationFrame = false;
    var __cancelAnimationFrame = false;
    var x, i;
    var vendorsReqestAnimationFrame = [
      "requestAnimationFrame",
      "mozRequestAnimationFrame",
      "webkitRequestAnimationFrame",
    ];
    for (x = 0; x < vendorsReqestAnimationFrame.length; x++) {
      if (!__requestAnimationFrame) {
        __requestAnimationFrame = window[vendorsReqestAnimationFrame[x]];
      }
    }
    __cancelAnimationFrame =
      window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  
    function __reqFrame(callback, element) {
      var timerID;
      if (__animationsTimedOut) {
        return 0;
      } else {
        timerID = __requestAnimationFrame(callback, element);
        __animationRequests.push(timerID);
        return timerID;
      }
    }
    for (x = 0; x < vendorsReqestAnimationFrame.length; x++) {
      window[vendorsReqestAnimationFrame[x]] = __reqFrame;
    }
    //   setTimeout(
    //     function () {
    //       for (i = 0; i < __animationRequests.length; i++) {
    //         __cancelAnimationFrame(__animationRequests[i]);
    //       }
    //       var ss = window.document.createElement("style");
    //       ss.textContent =
    //         "*, *::before, *::after { animation-play-state: running !important; }";
    //       var ref = window.document.getElementsByTagName("script")[0];
    //       ref.parentNode.insertBefore(ss, ref);
    //       __animationsTimedOut = true;
    //     },
    //     __animationDuration,
    //     "push"
    //   );
    window.setInterval = (function (oldSetInterval) {
      var registered = [];
  
      function f(a, b) {
        if (this.timedOut) {
          return 0;
        } else {
          return (registered[registered.length] = oldSetInterval(a, b));
        }
      }
      f.clearAll = function () {
        var r;
        while ((r = registered.pop())) {
          clearInterval(r);
        }
        this.timedOut = true;
      };
      f.timedOut = false;
      return f;
    })(window.setInterval);
    window.setTimeout = (function (oldSetTimeout) {
      var registered = [];
  
      function f(a, b, push) {
        if (this.timedOut && typeof push == "undefined") {
          return 0;
        } else {
          if (push) {
            return oldSetTimeout(a, b);
          } else {
            return (registered[registered.length] = oldSetTimeout(a, b));
          }
        }
      }
      f.clearAll = function () {
        var r;
        while ((r = registered.pop())) {
          clearTimeout(r);
        }
        this.timedOut = true;
      };
      f.timedOut = false;
      return f;
    })(window.setTimeout);
    setTimeout(
      function () {
        setTimeout.clearAll();
        setInterval.clearAll();
        if (
          document.timeline &&
          typeof document.timeline.getAnimations === "function"
        ) {
          document.timeline.getAnimations().map(function (animation) {
            animation.pause();
          });
        }
      },
      __animationDuration,
      "push"
    );
  })();
  if (document.location.search.match(/type=embed/gi)) {
    window.parent.postMessage("resize", "*");
  }
  (function () {
    setTimeout(
      function () {
        if (typeof _l == "undefined") {
          if (window.stop !== undefined) window.stop();
          else if (document.execCommand !== undefined)
            document.execCommand("Stop", false);
        }
      },
      2000,
      "push"
    );
  
    function pauseAnimations() {
      var body = document.getElementsByTagName("body")[0];
      if (body.addEventListener) {
        body.addEventListener("webkitAnimationStart", listener, false);
        body.addEventListener("webkitAnimationIteration", listener, false);
        body.addEventListener("animationstart", listener, false);
        body.addEventListener("animationiteration", listener, false);
      }
    }
  
    function listener(e) {
      var targetEl;
      if (
        e.type == "webkitAnimationStart" ||
        e.type == "webkitAnimationIteration"
      ) {
        targetEl = e.target;
        setTimeout(
          function () {
            targetEl.style.webkitAnimationPlayState = "running";
          },
          __animationDuration,
          "push"
        );
      } else if (e.type == "animationstart" || e.type == "animationiteration") {
        targetEl = e.target;
        setTimeout(
          function () {
            targetEl.style.MozAnimationPlayState = "running";
          },
          __animationDuration,
          "push"
        );
      }
    }
    pauseAnimations();
  
    function pauseElementTypes(type) {
      for (
        var i = 0, els = document.getElementsByTagName(type);
        i < els.length;
        i++
      ) {
        els[i].pause();
      }
    }
    setTimeout(function () {
      pauseElementTypes("audio");
      pauseElementTypes("video");
    }, 100);
  })();
  