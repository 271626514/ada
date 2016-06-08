
var g_img_pv = {};	//用于记录图片id和点击次数

function Fempty(v){
	if(v!=null && (typeof(v)=='object' || typeof(v)=='function')) return false;
	return ((""==v || undefined==v || null==v)?true:false);
}
function FaddEvent(e,evt,fn,isID)
{
	if(isID==true) e=Fid(e);
	if(!Fempty(e.attachEvent) && (typeof(e.attachEvent)=="function" || typeof(e.attachEvent)=="object"))
		e.attachEvent("on"+evt,fn);
	else if(!Fempty(e.addEventListener) && (typeof(e.addEventListener)=="function" || typeof(e.addEventListener)=="object"))
		e.addEventListener(evt,fn,false);
}
function stat_img_pv()
{
	if(!g_img_pv)
	{
		return;
	}
	var ids = '', counts = '';
	for(var picid in g_img_pv)
	{
		if(parseInt(picid) == picid)
		{
			ids += picid + ',';
			counts += g_img_pv[picid] + ',';
		}
	}
	ids = ids.substring(0, ids.length-1);
	counts = counts.substring(0, counts.length-1);

	var url = 'http://www.example.com/statimgpv.php?'+ids+'&counts='+counts+'&t='+Math.random();
	var img = new Image();
	img.src = url;
	setTimeout(function(){},1000);
}
FaddEvent(window, 'beforeunload', stat_img_pv, false);
