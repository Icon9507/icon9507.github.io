import {defineType, defineField, defineArrayMember} from 'sanity';

const mediaItem = defineType({
  name: 'mediaItem', title: '图片或视频', type: 'object',
  fields: [
    defineField({name:'kind', title:'素材类型', type:'string', initialValue:'video', options:{list:[{title:'视频',value:'video'},{title:'图片',value:'image'}],layout:'radio'}, validation:Rule=>Rule.required()}),
    defineField({name:'video', title:'视频文件', type:'file', options:{accept:'video/mp4,video/webm'}, hidden:({parent})=>parent?.kind!=='video', validation:Rule=>Rule.custom((value,ctx)=>ctx.parent?.kind==='video'&&!value?.asset?'请上传视频文件':true)}),
    defineField({name:'poster', title:'视频封面', type:'image', options:{hotspot:true}, hidden:({parent})=>parent?.kind!=='video'}),
    defineField({name:'image', title:'图片', type:'image', options:{hotspot:true}, hidden:({parent})=>parent?.kind!=='image', validation:Rule=>Rule.custom((value,ctx)=>ctx.parent?.kind==='image'&&!value?.asset?'请上传图片':true)}),
    defineField({name:'caption', title:'素材说明', type:'string'}),
    defineField({name:'autoplay', title:'进入可视区域时静音播放', type:'boolean', initialValue:false, hidden:({parent})=>parent?.kind!=='video'}),
    defineField({name:'loop', title:'循环播放', type:'boolean', initialValue:false, hidden:({parent})=>parent?.kind!=='video'})
  ],
  preview:{select:{title:'caption',kind:'kind',poster:'poster',image:'image'},prepare:({title,kind,poster,image})=>({title:title||(kind==='video'?'视频':'图片'),subtitle:kind==='video'?'视频':'图片',media:poster||image})}
});

const portfolioProject = defineType({
  name:'portfolioProject', title:'作品', type:'document',
  fields:[
    defineField({name:'title',title:'作品名称',type:'string',validation:Rule=>Rule.required().max(120)}),
    defineField({name:'slug',title:'链接标识',type:'slug',options:{source:'title',maxLength:96},description:'用于作品锚点链接，可点击 Generate 自动生成。'}),
    defineField({name:'description',title:'作品介绍',type:'text',rows:5}),
    defineField({name:'cover',title:'作品封面',type:'image',options:{hotspot:true}}),
    defineField({name:'media',title:'图片与视频',type:'array',of:[defineArrayMember({type:'mediaItem'})]}),
    defineField({name:'sortOrder',title:'排序',type:'number',initialValue:0,description:'数字越小越靠前。',validation:Rule=>Rule.integer()}),
    defineField({name:'visible',title:'在网站展示',type:'boolean',initialValue:true,description:'开启并点击 Publish 后，作品会出现在网站上。'})
  ],
  orderings:[{title:'排序',name:'sortOrder',by:[{field:'sortOrder',direction:'asc'}]}],
  preview:{select:{title:'title',media:'cover',visible:'visible'},prepare:({title,media,visible})=>({title,media,subtitle:visible?'网站展示':'网站隐藏'})}
});

const siteSettings = defineType({
  name:'siteSettings',title:'网站设置',type:'document',
  fields:[
    defineField({name:'title',title:'网站名称',type:'string',validation:Rule=>Rule.required().max(80)}),
    defineField({name:'description',title:'首页简介',type:'text',rows:3})
  ],
  preview:{prepare:()=>({title:'网站设置'})}
});

export const schemaTypes = [siteSettings, portfolioProject, mediaItem];
