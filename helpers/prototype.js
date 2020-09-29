exports.setupPrototypes = () => {
  Date.prototype.isToday = () => {
    const today = new Date();
    return (
      this.getDate() === today.getDate() &&
      this.getMonth() === today.getMonth() &&
      this.getFullYear() === today.getFullYear()
    );
  };
};
