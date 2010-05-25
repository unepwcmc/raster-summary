function SparseTileLayerOverlay()
{
	this._={};

	this.$={};

	this._.Q={alpha:[],level:[]};
}

(
function(_)
{
	var pair=[],offset=268435456,radius=268435456/Math.PI,degree=180/Math.PI;

	function LToX(x)
	{
		return Math.round(offset+radius*x/degree);
	}

	function LToY(y)
	{
		return Math.round(offset-radius*Math.log((1+Math.sin(y/degree))/(1-Math.sin(y/degree)))/2);
	}

	function XToL(x)
	{
		return degree*(Math.round(x)-offset)/radius;
	}

	function YToL(y)
	{
		return degree*(Math.PI/2-2*Math.atan(Math.exp((Math.round(y)-offset)/radius)));
	}

	_.setUrl=function(xy,z){return [];}

	_.setStyle=function(offset,properties)
	{
		var _=this._;

		var a,b,c,d,e,f,g,h,i,j,k,l,o,p,q,r,s,t,u,v,w,x,y,z;

		l=_.L;
		q=_.Q;

		if (l)
		{
			i=offset;

			for (a in properties)
			{
				if (q[a]) q[a][i]=properties[a];
			}

			for (a=0;l.childNodes[a];a++)
			{
				if (e=l.childNodes[a].childNodes[i])
				{
					if (q.alpha[i]==null) q.alpha[i]=1;
					if (q.level[i]==null) q.level[i]=0;

					e.style.display=q.alpha[i] ? "" : "none";
					e.style.zIndex =q.level[i];
				}
			}
		}
	}

	_.draw=function()
	{
		this.repair();
	}

	_.idle=function()
	{
		this.repair();
	}

	_.repair=function()
	{
		var _=this._;

		var a,b,c,d,e,f,g,h,i,j,k,l,o,p,q,r,s,t,u,v,w,x,y,z;

		var X$,Y$,X_,Y_,X0,X1,Y0,Y1;

		w=this.getMap();
		u=this.getPanes();
		v=this.getProjection();

		if (!w+!u+!v) return;

		l=w.getDiv();
		q=w.getBounds();
		c=w.getCenter();
		z=w.getZoom();

		var Q=8;

		var Z=21-z;

		q={x:LToX(c.lng())>>Z,y:LToY(c.lat())>>Z};

		c=v.fromLatLngToDivPixel(new google.maps.LatLng(YToL(q.y<<Z),XToL(q.x<<Z)));

		X0=q.x-((l.offsetWidth +1)>>1);
		X1=q.x+((l.offsetWidth +1)>>1);

		Y0=q.y-((l.offsetHeight+1)>>1);
		Y1=q.y+((l.offsetHeight+1)>>1);

		X$=q.x-c.x;
		Y$=q.y-c.y;

		X_=1+((X1-X0)>>Q)+1;
		Y_=1+((Y1-Y0)>>Q)+1;

		X0=((X0-0)>>Q)+0;
		X1=((X1-1)>>Q)+1;

		Y0=((Y0-0)>>Q)+0;
		Y1=((Y1-1)>>Q)+1;

		if ((z!=_.Z)+(X$!=_.X$)+(Y$!=_.Y$)+(X_!=_.X_)+(Y_!=_.Y_))
		{
			l=_.L;
			q=_.Q;

			if (l)
			{
				for (i=l.childNodes.length-1;i+1;i--)
				{
					o=l.childNodes[i];

					l.removeChild(o);
				}

				u.overlayLayer.removeChild(l);

				l=null;
			}

			l=document.createElement("DIV");

			if (l)
			{
				u.overlayLayer.appendChild(l);

				l.style.position="absolute";

				for (i=0;X_*Y_-i;i++)
				{
					o=document.createElement("DIV");

					l.appendChild(o);

					o.style.position="absolute";
				}
			}

			_.X$=X$;
			_.Y$=Y$;

			_.X_=X_;
			_.Y_=Y_;

			_.X0=0;
			_.Y0=0;

			_.X1=0;
			_.Y1=0;

			_.L=l;
			_.Z=z;
		}

		if ((z!=_.Z)+(X0<_.X0)+(Y0<_.Y0)+(X1>_.X1)+(Y1>_.Y1))
		{
			l=_.L;
			q=_.Q;

			i=(0%X_)+(0%Y_)*X_;

			for (X=X0;X0+X_-X;X++)
			for (Y=Y0;Y0+Y_-Y;Y++)
			{
				x=X^X>>z<<z;
				y=Y^Y>>z<<z;

				a=this.setUrl({x:x,y:y,X:1<<Q,Y:1<<Q,x0:XToL((x+0)<<Q<<Z),y0:YToL((y+0)<<Q<<Z),x1:XToL((x+1)<<Q<<Z),y1:YToL((y+1)<<Q<<Z)},z);

				if (typeof(a)!="object") a=[a];

				i=((X+X_)%X_)+((Y+Y_)%Y_)*X_;

				o=l.childNodes[i];

				o.style.position="absolute";

				o.style.left  =((X<<Q)-X$)+"px";
				o.style.top   =((Y<<Q)-Y$)+"px";

				o.style.width =(1<<Q)+"px";
				o.style.height=(1<<Q)+"px";

				if (a.length!=o.childNodes.length) for (i=o.childNodes.length-1;i+1;i--)
				{
					e=o.childNodes[i];

					o.removeChild(e);
				}

				if (a.length!=o.childNodes.length) for (i=0;a[i]!=null;i++)
				{
					e=document.createElement("DIV");

					o.appendChild(e);

					e.style.position="absolute";

					e.style.left  =0+"px";
					e.style.top   =0+"px";

					e.style.width ="100%";
					e.style.height="100%";

					if (q.alpha[i]==null) q.alpha[i]=1;
					if (q.level[i]==null) q.level[i]=0;

					e.style.display=q.alpha[i] ? "" : "none";
					e.style.zIndex =q.level[i];
				}

				for (i=0;a[i]!=null;i++)
				{
					e=o.childNodes[i];

					if ((!window.XMLHttpRequest)*(!/[\&\?]format\=image\/(gif|jpeg)[\&\?]/gi.test(a[i]+"?")))
					{
						e.style.backgroundImage="";

						if (a[i]=="") e.style.filter="";

						else if (a[i]!=e.src) e.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+a[i]+"',sizingMethod='scale')";
					}

					else
					{
						e.style.filter="";

						if (a[i]=="") e.style.backgroundImage="";

						else if (a[i]!=e.src) e.style.backgroundImage="url"+"("+a[i]+")";
					}

					e.src=a[i];
				}
			}

			_.X0=X0;
			_.Y0=Y0;

			_.X1=X1;
			_.Y1=Y1;

			_.L=l;
			_.Z=z;
		}
	}
}
)
(SparseTileLayerOverlay.prototype=new google.maps.OverlayView);