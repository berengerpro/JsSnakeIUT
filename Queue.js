
function Queue() {
  var a = [],
    b = 0;
  this.getLength = function() {
    return a.length - b;
  };
  this.isEmpty = function() {
    return 0 == a.length;
  };
  this.enqueue = function(b) {
    a.push(b);
  };
  this.dequeue = function() {
    if (0 != a.length) {
      var c = a[b];
      2 * ++b >= a.length && ((a = a.slice(b)), (b = 0));
      return c;
    }
  };
  this.peek = function() {
    return 0 < a.length ? a[b] : void 0;
  };
  this.checkAutoCollision = function() {
    var collision = false;
    for(var e in a)
    {
      collision = collision || (a[e] != this.peek() && this.peek().getPosition()[0] == a[e].getPosition()[0] && this.peek().getPosition()[1] == a[e].getPosition()[1]);
    }
    return collision;
  }
}
