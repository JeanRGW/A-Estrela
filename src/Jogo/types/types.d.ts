import { EventEmitter } from "stream";

export default interface IInput extends EventEmitter {
    public setOn(labirinto?: number[][]);
    public setOff();
}