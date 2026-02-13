
class PopupService {
  static instance = null;

  static getInstance() {
    if (!PopupService.instance) {
      PopupService.instance = new PopupService();
    }
    return PopupService.instance;
  }

  setPopupRef(ref) {
    this.popupRef = ref;
  }

  show(title, message, type = 'info') {
    if (this.popupRef) {
      this.popupRef.show(title, message, type);
    }
  }

  success(message, title = 'Success!') {
    this.show(title, message, 'success');
  }

  error(message, title = 'Error!') {
    this.show(title, message, 'error');
  }

  info(message, title = 'Information') {
    this.show(title, message, 'info');
  }
}

export default PopupService.getInstance();