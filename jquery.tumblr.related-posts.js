/*!
 * Merge Sort in JavaScript v1.0
 * http://github.com/justinforce/merge-sort
 *
 * Copyright (c) 2011, Justin Force
 * Licensed under the BSD 3-Clause License
 */
(function () {
	'use strict';
	
	// Add stable merge sort method to Array prototype
	if( !Array.mergeSort )
	{
		Array.prototype.mergeSort = function(compare){
			var length = this.length,
				middle = Math.floor(length / 2);
	
			// define default comparison function if none is defined
			if( !compare ) 
			{
				compare = function(left, right){
					if( left  <  right )
					{
						return -1;
					} 
					else if( left === right )
					{
						return 0;
					} 
					else 
					{
						return 1;
					}
				}
			}
	
			if( length < 2 ) 
			{
				return this;
			}
	
			function merge(left, right, compare){
				var result = [];
	
				while( left.length > 0 || right.length > 0 )
				{
					if( left.length > 0 && right.length > 0 )
					{
						if( compare(left[0], right[0]) <= 0 )
						{
							result.push(left[0]);
							
							left = left.slice(1);
						}
						else
						{
							result.push(right[0]);
							
							right = right.slice(1);
						}
					}
					else if( left.length > 0 )
					{
						result.push(left[0]);
						
						left = left.slice(1);
					}
					else if( right.length > 0 )
					{
						result.push(right[0]);
						
						right = right.slice(1);
					}
				}
				
				return result;
			}
	
			return merge(this.slice(0, middle).mergeSort(compare), this.slice(middle, length).mergeSort(compare), compare);
		};
	}
	
	// Add merge sort to jQuery if it's present
	if( window.jQuery !== undefined ) 
	{
		jQuery.fn.mergeSort = function(compare){
			return jQuery(Array.prototype.mergeSort.call(this, compare));
		};
		jQuery.mergeSort = function(array, compare){
			return Array.prototype.mergeSort.call(array, compare);
		};
	}
}());

/**
*	Create list of related posts by tag
**/
$.fn.relatedPosts = function(options){	
	var settings = $.extend({
		tumblrSite: location.hostname,
		maxPosts: 5,
		header: 'Related posts',
		headerTag: 'h3',
		titleTag: 'h4',
		showImage: true,
		postLength: 200,
		deleteOnEmpty: true,
		tags: ''
	}, options );
	
	var self = this,
		tags = settings.tags.split(','),
		postsList = new Array();
		
	tags.pop();
	
	/**
	*	Remove duplicate objects by key
	**/
	var removeDuplicatesByKey = function(list, key){
		list.sort(function(a, b){
			return a[key] - b[key];
		});
		
		for( var i = 0; i < list.length - 1; i++) 
		{
			if( list[i][key] == list[i + 1][key] )
			{
				delete list[i];
			}
		}
		
		return list.filter(function(el){ 
			return typeof el !== "undefined";
		});
    }

	/**
	*	Prepare posts and display it
	**/
	var displayRelatedPosts = function(){
		// Remove the current post from the list
		postsList = postsList.filter(function(item){
			return item.id != settings.postID;
		});

		postsList = removeDuplicatesByKey(postsList, 'id');

		// Sort by ID first
		postsList.sort(function(a, b){
			return a.id < b.id ? 1 : -1;
		});
		
		var tempList;

		// Then sort by a tag priority
		for( var i = (tags.length - 1); i >= 0; i-- )
		{		
			tempList = postsList.mergeSort(function(a, b){
				if( a.tags[i] == tags[i] || b.tags[i] == a.tags[i] )
				{
					return -1;
				}
				else
				{
					return 1;
				}
			});
		}

		var postsCount = tempList.length;
		
		if( postsCount )
		{
			$(self).show();
			$(self).append('<' + settings.headerTag + '>' + settings.header + '</' + settings.headerTag + '>');
			$(self).append('<ul />');
			
			var $list = $(self).find('ul');
			
			for( var i = 0; i < (postsCount > settings.maxPosts ? settings.maxPosts : postsCount); i++ )
			{
				var post = tempList[i],
					image = null,
					imageTag = '',
					cleanBody = '',
					body = post.body != null ? post.body : '',
					title = post.title != null ? post.title : '';
				
				if( body != null )
				{
					image = /img.*?src=[\'|\"]+([^'"]+)[\'|\"]+/.exec(body);
					imageTag = '';
				
					if( image != null && settings.showImage )
					{
						imageTag = '<a href="' + post.post_url + '"><img src="' + image[1] + '" alt="' + title + '"></a>';
					}
					
					cleanBody = body.replace(/<.*?>+/g, '').substr(0, settings.postLength);
					cleanBody += '...';
				}
									
				$list.append('<li>' + imageTag + '<' + settings.titleTag + '><a href="' + post.post_url + '">' + title + '</a></' + settings.titleTag + '><p>' + cleanBody + ' <a href="' + post.post_url + '">Read more</a></p></li>');
			}
		}
		else if( settings.deleteOnEmpty ) // Remove box if empty
		{
			$(self).remove();
		}
	}

	/**
	* Get posts by tag
	**/	
	var getPosts = function(data){
		var posts = data.response.posts;
				
		for( var i = 0; i < posts.length; i++ )
		{
			postsList.push(posts[i]);
		}
	}
	
	// Disable AJAX caching because of Firefox
	$.ajaxSetup({
		cache: false
	});
	
	// Hack for ajaxStop() to function properly
	jQuery.ajaxPrefilter(function(options){
	    options.global = true;
	});
	
	$(document).ajaxStop(function(){
		displayRelatedPosts();
	});
	
	for( var i = 0; i < tags.length; i++ )
	{	
		$.ajax({
			type: 'GET',
			url: 'http://api.tumblr.com/v2/blog/' + settings.tumblrSite + '/posts',
			dataType: 'jsonp',
			
			data: {
				api_key: settings.apiKey,
				tag: tags[i],
				limit: settings.maxPosts,
			},
						
			success: function(json){
				getPosts(json);
			}
		});
	}
};
