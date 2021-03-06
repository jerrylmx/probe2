var Utils = require('./utils');
class FrameManager {
  constructor(config = {}) {
      // Server rate
      this.rate = config.rate || 25;

      // Circular frame queue
      this.queue = [];

      // Queue size
      this.capacity = config.capacity || 3;

      // Next slot
      this.top = 0;

      // Ready
      this.ready = false;

      this.hist = [];
      this.enabled = true;
      this.currentFrame = null;
      this.ignoreNext = 0;
      this.recovering = false
  }

  push(data) {
    // Real frame from server
    let timeElapsed = this.currentFrame? new Date().getTime() - this.currentFrame.time:this.rate;
    console.log(`Time elapsed: ${timeElapsed}`);
    this.ready = true;
    let frame = {
        time: new Date().getTime(),
        payload: data
    };
    this.currentFrame = frame;

    // Filling stage
    if (this.queue.length < this.capacity) {
        this.queue.push(frame);
        this.top++;
        return;
    }
    // Skipping stage
    if (this.ready && !this.recovering && timeElapsed >= this.rate * 1.5) {
      this.ignoreNext += Math.ceil(timeElapsed / this.rate);
    }

    // Rotation stage
    if (this.ignoreNext > 0) {
      console.log('skipping')
      this.ignoreNext -= 1;
      if (this.ignoreNext === 0) {
        this.recovering = true;
      }
      return;
    } else {
        this.top = this.top % this.capacity;
        this.ready = true;
        this.queue[this.top] = frame;
        this.top++;
        if (this.recovering) this.recovering = false;
    }
  }

  // x0 ----- x2 latest
  pop() {
    let x2 = this.queue[(this.top - 1 + this.capacity) % this.capacity];
    let x1 = this.queue[(this.top - 2 + this.capacity) % this.capacity];
    let x0 = this.queue[(this.top - 3 + this.capacity) % this.capacity];

    let res = Utils.clone(x1).payload;
    if (!this.enabled) return res;
    for (let i = 0; i < Object.keys(x2.payload).length; i++) {
        let key = Object.keys(x2.payload)[i];
        let ref1 = x2.payload[key];
        let ref0 = x1.payload[key];

        // No interpolation on non-spacial, or new objects
        if (!ref1 || !ref1.x || !ref1.y || !ref0 || !ref0.x || !ref0.y) {
            continue;
        } else {
            let gap = this.rate;
            let r = (new Date().getTime() - x2.time) / gap;
            let dx = ref1.x - ref0.x;
            let dy = ref1.y - ref0.y;
            res[key].x = ref0.x + dx * r;
            res[key].y = ref0.y + dy * r;
        }
    }
    return res;
  }

  //
//   frameValidate(frame) {
//       // Directional score tolerance
//       let tol = 1.8;
//       let frameNew = {
//           time: new Date().getTime(),
//           payload: {}
//       };
//       let framePrev1 = this.queue[(this.top - 1 + this.capacity) % this.capacity];
//       let framePrev2 = this.queue[(this.top - 2 + this.capacity) % this.capacity];
//       for (let i = 0; i < Object.keys(frame.payload).length; i++) {
//           let id = Object.keys(frame.payload)[i];
//           let f1 = frame.payload[id];
//           let fc = this.currentFrame.payload[id];
//           let fp1 = framePrev1.payload[id];
//           let fp2 = framePrev2.payload[id];

//           if (!fc || !f1.direction || !fc.direction || !f1.x || !fc.x || !fp1 || !fp2) {
//               frameNew.payload[id] = f1;
//               continue;
//           }
//           let diff = Utils.normalize({x: f1.x - fc.x, y: f1.y - fc.y}, 1);

//           let err = Utils.vsum(diff, f1.direction);

//           // The amount which f1 and diff agrees on moving direction (between 0 and 2)
//           let vscore = Utils.magnitude(err);
//           let dscore = Utils.magnitude({x: f1.x - fc.x, y: f1.y - fc.y});

//           // fc and f1 agrees on moving direction, f1 is valid
//           if (vscore > tol) {
//               this.hist = [];
//               frameNew.payload[id] = f1;
//           } else if (this.hist.length < 10) {
//               // f1.expired = true;
//               this.hist.push(f1);
//               frameNew.payload[id] = fp1? fp1 : f1;
//               this.queue[(this.top - 1 + this.capacity) % this.capacity].payload[id] = fp2;
//           } else {
//               this.hist = [];
//               frameNew.payload[id] = f1;
//           }
//       }
//       return frameNew;
//   }
}
module.exports = FrameManager;

