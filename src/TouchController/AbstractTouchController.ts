import TimeVector2 from './TimeVector2';
import Touch from './Touch';
import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';


//class Touch


export default class TouchController extends AbstractClassWithSubscribe<"START" | "MOVE" | "END", Touch> {

    public ongoingTouches: Touch[] = [];

    constructor(public element: HTMLElement) {
        super();
    }

    touchStart(touch: Touch) {
        this.ongoingTouches.push(touch);
        this.callSubscribers('START', touch);
    }

    touchMove(id: string, end: boolean, event: { clientX: number, clientY: number }) {
        const index = this._ongoingTouchIndexById(id);
        if (index !== -1) {
            const touch = this.ongoingTouches[index];
            touch.move(new TimeVector2(
                event.clientX / this.element.clientWidth,
                event.clientY / this.element.clientHeight,
                performance.now()
            ),end);
            if (end) {
                this.ongoingTouches.splice(index, 1);
                this.callSubscribers('END', touch);
            }else{
                this.callSubscribers('MOVE', touch);
            }
        } else {
            //console.warn(`Can't find touch with id "${id}".`);
        }
    }

    private _ongoingTouchIndexById(idToFind: string): number {
        for (let i = 0; i < this.ongoingTouches.length; i++) {
            const id = this.ongoingTouches[i].id;

            if (id === idToFind) {
                return i;
            }
        }
        return -1;
    }

}