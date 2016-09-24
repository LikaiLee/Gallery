//3.通用函数
function g(selector) {
    var method = selector.substr(0, 1) == "." ? "getElementsByClassName" : "getElementById";
    return document[method](selector.substr(1));
}
//随机生成一个值 支持取值范围 random([min,max])
function random(range) {
    var max = Math.max(range[0], range[1]);
    var min = Math.min(range[0], range[1]);
    var diff = max - min;
    var number = Math.ceil(Math.random() * diff + min);

    return number;

}

//4.输出所有的海报
var data = data;
function addPhotos() {
    var _wrap = '';
    var _nav = '';
    for (var i = 0; i < data.length; i++) {
        _wrap += '<div class="photo  photo_front" onclick="turn(this)" id="photo_' + i + '">' +
            '<div class="photo-wrap">' +
            '<div class="side side-front">' +
            '<p class="image"><img src="images/' + data[i].img + '"></p>' +
            '<p class="caption">' + data[i].caption + '</p></div>' +
            '<div class="side side-back"><p class="desc">' + data[i].desc + '</p></div></div></div></div>';

        _nav += '<span id="nav_' + i + '" onclick="turn(g(\'#photo_' + i + '\'))" class="i"></span>';
    }
    var nav = '<div class="nav">' + _nav + '</div>';
    g('#wrap').innerHTML = _wrap + nav;
    rsort(random([0, data.length]));

}
addPhotos();

//6.计算左右分区的范围 {left:{ x: [min,max] , y: [] },right:{}}
function range() {
    var range = {
        //左分区取值
        left: {
            x: [], y: []
        },
        //右分区取值
        right: {
            x: [], y: []
        }
    }
    //容器宽高
    var wrap = {
        w: g("#wrap").clientWidth,
        h: g("#wrap").clientHeight
    }
    //海报宽高
    var photo = {
        w: g(".photo")[0].clientWidth,
        h: g(".photo")[0].clientHeight
    }
    range.wrap = wrap;
    range.photo = photo;
    //左分区取值范围left:{ x: [min = -海报宽度,max = (可视宽度 - 海报宽度)/2]
    //y         -海报高度 ，可视高度
    range.left.x = [0 - photo.w, wrap.w / 2 - photo.w / 2];
    range.left.y = [0 - photo.h, wrap.h];

    //右分区取值范围
    //可视宽度 /2 + 海报宽度/2 ， 可视宽度 + 海报宽度
    range.right.x = [wrap.w / 2 + photo.w / 2, wrap.w + photo.w];
    range.right.y = [0 - photo.h, wrap.h];

    return range;
}

//5.排序海报
function rsort(n) {
    var _photo = g(".photo");

    var photos = [];
    //先去除中间海报 再生成
    for (s = 0; s < _photo.length; s++) {
        //去除中间的photo
        _photo[s].className = _photo[s].className.replace(/\s*photo_center\s*/, " ");
        //点击非中间海报时去除其默认样式 使其居中
        _photo[s].className = _photo[s].className.replace(/\s*photo_front\s*/, " ");
        _photo[s].className = _photo[s].className.replace(/\s*photo_back\s*/, " ");

        //翻转效果
        _photo[s].className += " photo_front";
        _photo[s].style.left = "";
        _photo[s].style.top = "";
        _photo[s].style["transform"] = "rotate(360deg) scale(1.3)";
        //将_photo转为数组
        photos.push(_photo[s]);
    }
    var photo_center = g("#photo_" + n);
    photo_center.className += " photo_center";
    //获取除 center 外的所有海报
    photo_center = photos.splice(n, 1)[0];

    //将海报分为左右部分
    var photos_left = photos.splice(0, Math.ceil(photos.length / 2));
    var photos_right = photos;
    var ranges = range();
    for (s in photos_left) {
        var photo = photos_left[s];
        //设置左海报位置
        photo.style.left = random(ranges.left.x) + "px";
        photo.style.top = random(ranges.left.y) + "px";
        //设置翻转角度
        photo.style["transform"] = "rotate(" + random([-150, 150]) + "deg) scale(1)";
    }

    for (s in photos_right) {
        var photo = photos_right[s];
        //设置右海报位置
        photo.style.left = random(ranges.right.x) + "px";
        photo.style.top = random(ranges.right.y) + "px";
        //设置翻转角度
        photo.style["transform"] = "rotate(" + random([-150, 150]) + "deg) scale(1)";
    }
    //选择中间的海报 设置按钮
    var navs = g(".i");
    //去除其他按钮样式
    for (var s = 0; s < navs.length; s++) {
        navs[s].className = navs[s].className.replace(/\s*i_current\s*/, " ");
        navs[s].className = navs[s].className.replace(/\s*i_back\s*/, " ");
    }
    g("#nav_" + n).className += " i_current ";

}


//1.翻面控制
function turn(elem) {
    var cls = elem.className;
    //获取序号
    var n = elem.id.split("_")[1];

    //点击非中间海报时切换
    if (!/photo_center/.test(cls)) {
        return rsort(n);
    }

    //检测参数是否有photo_front
    if (/photo_front/.test(cls)) {
        cls = cls.replace(/photo_front/, "photo_back");
        g("#nav_" + n).className += " i_back ";
    } else {
        cls = cls.replace(/photo_back/, "photo_front");
        g("#nav_" + n).className = g("#nav_" + n).className.replace(/\s*i_back\s*/, " ");
    }
    return elem.className = cls;
}
