/**
 * VERSION: 1.01
 * DATE: 7/15/2009
 * AS3 (AS2 is also available)
 * UPDATES AND DOCUMENTATION AT: http://blog.greensock.com/customease/
 **/
/**
 *     Facilitates creating custom bezier eases with the GreenSock Custom Ease Builder tool. It's essentially
 *  a place to store the bezier segment information for each ease instead of recreating it inside each
 *  function call which would slow things down. Please use the interactive tool available at
 *  http://blog.greensock.com/customease/ to generate the necessary code.
 *
 * <b>Copyright 2009, GreenSock. All rights reserved.</b> This work is subject to the terms in <a href="http://www.greensock.com/terms_of_use.html">http://www.greensock.com/terms_of_use.html</a> or for corporate Club GreenSock members, the software agreement that was issued with the corporate membership.
 *
 * @author Jack Doyle, jack@greensock.com
 */
class CustomEase {
	private static _all:any = {}; //keeps track of all CustomEase instances.

	private _segments:any[] = [];

	public static create(name:string, segments:any[]):(time:number, start:number, change:number, duration:number) => any {
		var b:CustomEase = new CustomEase(name, segments);

		return b.ease.bind(b);
	}

	public static byName(name:string):() => any {
		return _all[name].ease;
	}

	constructor(private _name:string, segments:any[]) {
		for (var i = 0; i < segments.length; i++) {
			this._segments[this._segments.length] = new Segment(segments[i].s, segments[i].cp, segments[i].e);
		}

		CustomEase._all[_name] = this;
	}

	public ease(time:number, start:number, change:number, duration:number):number {
		var factor:number = time / duration,
			qty = this._segments.length,
			i:number = Math.floor(qty * factor),
			t:number,
			s:Segment;

		t = (factor - (i * (1 / qty))) * qty;
		s = this._segments[i];

		return start + change * (s.s + t * (2 * (1 - t) * (s.cp - s.s) + t * (s.e - s.s)));
	}

	public destroy():void {
		this._segments = null;
		delete CustomEase._all[this._name];
	}
}

//allows for strict data typing, making lookups faster
class Segment {
	public s:number;
	public cp:number;
	public e:number;

	constructor(s:number, cp:number, e:number) {
		this.s = s;
		this.cp = cp;
		this.e = e;
	}
}