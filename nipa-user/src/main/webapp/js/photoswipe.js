	var initPhotoSwipeFromDOM = function(gallerySelector) {
	
		// DOM 요소에서 슬라이드 데이터 (url, title, size ...)를 파싱 - 갤러리 셀렉터의 자식
	    var parseThumbnailElements = function(el) {
	        var thumbElements = el.childNodes,
	            numNodes = thumbElements.length,
	            items = [],
	            figureEl,
	            linkEl,
	            size,
	            item;
	
	        for(var i = 0; i < numNodes; i++) {
	
	            figureEl = thumbElements[i]; // <figure> element
	
	            if(figureEl.nodeType !== 1) {
	                continue;
	            }
	
	            linkEl = figureEl.children[0]; // <a> element
	
	            size = linkEl.getAttribute('data-size').split('x');
	
	            // slide object 생성
	            item = {
	                src: linkEl.getAttribute('href'),
	                w: parseInt(size[0], 10),
	                h: parseInt(size[1], 10)
	            };
	
	            if(figureEl.children.length > 1) {
	                // <figcaption> content
	                item.title = figureEl.children[1].innerHTML; 
	            }
	            
	            if(linkEl.children.length > 0) {
	                // <img> thumbnail element, retrieving thumbnail url
	                item.msrc = linkEl.children[0].getAttribute('src');
	            } 
	            
	            item.el = figureEl; // save link to element for getThumbBoundsFn
	            items.push(item);
	        }
	        return items;
	    };
	
	    // 부모 요소
	    var closest = function closest(el, fn) {
	        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	    };
	
	    // 미리보기 이미지를 클릭
	    var onThumbnailsClick = function(e) {
	        e = e || window.event;
	        e.preventDefault ? e.preventDefault() : e.returnValue = false;
	
	        var eTarget = e.target || e.srcElement;
	
	        // find root element of slide
	        var clickedListItem = closest(eTarget, function(el) {
	            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
	        });
	
	        if(!clickedListItem) {
	            return;
	        }
	
	        // find index of clicked item by looping through all child nodes
	        // alternatively, you may define index via data- attribute
	        var clickedGallery = clickedListItem.parentNode,
	            childNodes = clickedListItem.parentNode.childNodes,
	            numChildNodes = childNodes.length,
	            nodeIndex = 0,
	            index;
	
	        for (var i = 0; i < numChildNodes; i++) {
	            if(childNodes[i].nodeType !== 1) { 
	                continue; 
	            }
	
	            if(childNodes[i] === clickedListItem) {
	                index = nodeIndex;
	                break;
	            }
	            nodeIndex++;
	        }
	        
	     	// open PhotoSwipe
	        if(index >= 0) {
	            openPhotoSwipe( index, clickedGallery );
	        }
	        return false;
	    };
	    
		// URL(#& pid=1&gid=2)에서 사진 및 갤러리 index
	    var photoswipeParseHash = function() {
	        var hash = window.location.hash.substring(1),
	        params = {};
	
	        if(hash.length < 5) {
	            return params;
	        }
	
	        var vars = hash.split('&');
	        for (var i = 0; i < vars.length; i++) {
	            if(!vars[i]) {
	                continue;
	            }
	            var pair = vars[i].split('=');  
	            if(pair.length < 2) {
	                continue;
	            }           
	            params[pair[0]] = pair[1];
	        }
	
	        if(params.gid) {
	            params.gid = parseInt(params.gid, 10);
	        }
	
	        return params;
	    };
	
	    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
	        var pswpElement = document.querySelectorAll('.pswp')[0],
	            gallery,
	            options,
	            items;
	
	        items = parseThumbnailElements(galleryElement);
	
	        // 옵션 (선택사항)
	        options = {
	
	            // URL용 갤러리 index 정의
	            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
	
	            getThumbBoundsFn: function(index) {
	                // See Options -> getThumbBoundsFn section of documentation for more info
	                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
	                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
	                    rect = thumbnail.getBoundingClientRect(); 
	
	                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
	            }
	
	        };
	
	        // URL로 PhotoSwipe opene 
	        if(fromURL) {
	            if(options.galleryPIDs) {
	                for(var j = 0; j < items.length; j++) {
	                    if(items[j].pid == index) {
	                        options.index = j;
	                        break;
	                    }
	                }
	            } else {
	            	// URL 색인에서 1부터 시작
	                options.index = parseInt(index, 10) - 1;
	            }
	        } else {
	            options.index = parseInt(index, 10);
	        }
	
	        // index가 없는 경우 종료
	        if( isNaN(options.index) ) {
	            return;
	        }
	
	        if(disableAnimation) {
	            options.showAnimationDuration = 0;
	        }
	
	        // PhotoSwipe에 데이터를 전달하고 초기화
	        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
	        gallery.init();
	    };
	
	    var galleryElements = document.querySelectorAll( gallerySelector );
	
	    for(var i = 0, l = galleryElements.length; i < l; i++) {
	        galleryElements[i].setAttribute('data-pswp-uid', i+1);
	        galleryElements[i].onclick = onThumbnailsClick;
	    }
	
	    // #&pid=3&gid=1이 있으면 URL을 파싱하고 갤러리를 open
	    var hashData = photoswipeParseHash();
	    if(hashData.pid && hashData.gid) {
	        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
	    }
	};
	
	// execute above function
	//initPhotoSwipeFromDOM('#thumbnail');
