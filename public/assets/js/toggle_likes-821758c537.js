class ToggleLike{constructor(t){this.toggler=t,this.toggleLike()}toggleLike(){$(this.toggler).click((function(t){t.preventDefault();let e=this;$.ajax({type:"post",url:$(e).attr("href"),success:function(t){let s=parseInt($(e).attr("data-likes"));t.data.deleted?s-=1:s+=1,$(e).attr("data-likes",s),$(e).html(`${s} Likes`)},error:function(t){console.log(t.responseText)}})}))}}