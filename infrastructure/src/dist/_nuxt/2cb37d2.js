(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{679:function(t,e,n){"use strict";n.r(e);n(51);var o=n(199),r=n(200),c=n(68),progress=n(201),l=n(100),d=n(0),f={components:{BCard:o.a,BCardText:r.a,BButton:c.a,BProgress:progress.a,BIcon:l.a,BIconPlay:d.Uq,BIconPause:d.gq,BIconStop:d.et},props:{loaded:{type:Boolean,default:!1},playing:{type:Boolean,default:!1},paused:{type:Boolean,default:!1},currentTime:{type:Number,default:0},duration:{type:Number,default:100}},data:function(){return{percentage:0}},watch:{currentTime:function(){this.percentage=Math.floor(this.currentTime/this.duration*100)}},methods:{setPosition:function(){},stop:function(){this.$emit("stop")},play:function(){this.$emit("play")},pause:function(){this.paused?this.play():this.$emit("pause")}},mounted:function(){}},m=n(37),component=Object(m.a)(f,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("b-card",{staticStyle:{"text-align":"center"}},[n("b-card-text",[n("b-button",{staticClass:"mr-2",attrs:{variant:"outline-primary",disabled:!t.loaded},on:{click:function(e){t.playing?t.pause():t.play()}}},[!t.playing||t.paused?n("b-icon",{attrs:{icon:"play","aria-hidden":"true"}}):n("b-icon",{attrs:{icon:"pause","aria-hidden":"true"}})],1),t._v(" "),n("b-button",{staticClass:"mr-2",attrs:{variant:"outline-primary",icon:"",disabled:!t.loaded},on:{click:function(e){return t.stop()}}},[n("b-icon",{attrs:{icon:"stop","aria-hidden":"true"}})],1),t._v(" "),n("b-progress",{staticStyle:{"margin-top":"15px","margin-bottom":"15px"},attrs:{height:"5",disabled:!t.loaded},on:{click:function(e){return t.setPosition()}},model:{value:t.percentage,callback:function(e){t.percentage=e},expression:"percentage"}})],1)],1)}),[],!1,null,null,null);e.default=component.exports}}]);