TumblrRelatedPosts is a simple plugin that let's you retrieve all posts by specified tags from your blog and display it in a list. 

It has no external dependencies other than jQuery.

##How to Use##

Include css inside a head element:

    <link rel="stylesheet" href="jquery.tumblr.related-posts.min.css">

Include javascript inside a head element:

    <script src="jquery.tumblr.related-posts.min.js"></script>

Load the plugin (remove tumblr tags if you load the plugin outside a tumblr template):
    
    <script>
    $(document).ready(function(){
    {block:Posts}
    {block:HasTags}
      $('#related-posts').relatedPosts({
		    apiKey: 'your-api-key',
		    tumblrSite: 'your-blog.tumblr.com',
		   	tags: '{block:Tags}{Tag},{/block:Tags}',
		   	postID: {PostID}
	    });
    {/block:Posts}
    {/block:HasTags}
    });
    </script>
    
Add little bit of html where related posts would be inserted:

    <ul id="related-posts"></ul>
    
##Parameters##
**apiKey** - your tumblr API key that you need to [register](http://www.tumblr.com/oauth/apps)

**tumblrSite** - link to your tumblr site e.g. mariodian.tumblr.com

**tags** - list of tumblr tags to find posts for. The order sets the tag priority, example: "south korea,asia,travel," means that posts will be sorted first by "south korea", than "asia".

**postID** - current post that will not be shown in the list

**maxPosts** [default: 5] - maximum number of related posts that will be displayed

**header** [default: 'Related posts'] - header for the box of related posts

**headerTag** [default: 'h3'] - html tag for header

**titleTag** [default: 'h4'] - html tag for post title

**showImage** [default: true] - parse a first img tag from post body and display it if it exists

**postLength** [default: 200] - number of characters of the post to be shown

**deleteOnEmpty** [default: true] - delete the whole box if no related posts have been found
