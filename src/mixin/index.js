export const userFullScreen = {
  methods: {
    toggleFullscreen() {
      this.isFullscreen() ? this.exit() : this.enter(document.documentElement);
    },
    isFullscreen() {
      return (
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.msFullscreenElement ||
        null
      );
    },
    enter(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        // Safari
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        // Firefox
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        // IE/Edge
        element.msRequestFullscreen();
      }
    },
    exit() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  }
};

export const tranRoleMixin = {
  methods: {
    tranRoleFn(role) {
      switch (role) {
        case 'member':
          return '';
        case 'lord':
          return '群主';
        case 'admin':
          return '管理员';
        case 'super-admin':
          return '超级管理员';
      }
    }
  }
};

// const permissionList = {}
