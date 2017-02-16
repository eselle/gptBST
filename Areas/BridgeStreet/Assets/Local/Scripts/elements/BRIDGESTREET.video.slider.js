(function () {

    var VideoSlider = {

        init : function (win) {

        	if (DOMUtils.isUndefined(document.getElementsByClassName('video-slider')[0])) return;
			
            this.$window = win;

            var dragging = false,
                scrolling = false,
                resizing = false;

            var videos = {
                a: Popcorn("#example_video_1"),    
                b: Popcorn("#example_video_2"), 
                
            },

            loadCount = 0, 
            events = "play pause timeupdate seeking".split(/\s+/g);

            requestAnimFrame = (function(){
              return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function( callback, element ) {
                  window.setTimeout( callback, 16 );
                };
            }());   


            var imageComparisonContainers = jQuery('.cd-image-container');
            //check if the .cd-image-container is in the viewport 
            //if yes, animate it
            checkPosition(imageComparisonContainers);

            jQuery(window).on('scroll', function(){
                if( !scrolling) {
                    scrolling =  true;
                    ( !window.requestAnimationFrame )
                        ? setTimeout(function(){checkPosition(imageComparisonContainers);}, 100)
                        : requestAnimationFrame(function(){checkPosition(imageComparisonContainers);});
                }
            });

            //make the .cd-handle element draggable and modify .cd-resize-img width according to its position
            imageComparisonContainers.each(function(){
                var actual = jQuery(this);
                drags(actual.find('.cd-handle'), actual.find('.cd-resize-img'), actual, actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-image-label[data-type="modified"]'));
            });

            //upadate images label visibility
            jQuery(window).on('resize', function(){
                if( !resizing) {
                    resizing =  true;
                    ( !window.requestAnimationFrame )
                        ? setTimeout(function(){checkLabel(imageComparisonContainers);}, 100)
                        : requestAnimationFrame(function(){checkLabel(imageComparisonContainers);});
                }
            });

            function checkPosition(container) {
                container.each(function(){
                    var actualContainer = jQuery(this);
                    if( jQuery(window).scrollTop() + jQuery(window).height()*0.5 > actualContainer.offset().top) {
                        actualContainer.addClass('is-visible');
                    }
                });

                scrolling = false;
            }

            function checkLabel(container) {
                container.each(function(){
                    var actual = jQuery(this);
                    updateLabel(actual.find('.cd-image-label[data-type="modified"]'), actual.find('.cd-resize-img'), 'left');
                    updateLabel(actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-resize-img'), 'right');
                });

                resizing = false;
            }

            //draggable funtionality - credits to http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
            function drags(dragElement, resizeElement, container, labelContainer, labelResizeElement) {
                dragElement.on("mousedown vmousedown", function(e) {
                    console.log('mousedown');

                    jQuery(document).trigger('sjs:synchronize');

                    dragElement.addClass('draggable');
                    resizeElement.addClass('resizable');

                    var dragWidth = dragElement.outerWidth(),
                        xPosition = dragElement.offset().left + dragWidth - e.pageX,
                        containerOffset = container.offset().left,
                        containerWidth = container.outerWidth(),
                        minLeft = containerOffset + 10,
                        maxLeft = containerOffset + containerWidth - dragWidth - 10;
                    
                    dragElement.parents().on("mousemove vmousemove", function(e) {
                        if( !dragging) {
                            dragging =  true;
                            ( !window.requestAnimationFrame )
                                ? setTimeout(function(){animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement);}, 100)
                                : requestAnimationFrame(function(){animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement);});
                        }
                    }).on("mouseup vmouseup", function(e){
                        dragElement.removeClass('draggable');
                        resizeElement.removeClass('resizable');
                    });
                    e.preventDefault();
                }).on("mouseup vmouseup", function(e) {
                    dragElement.removeClass('draggable');
                    resizeElement.removeClass('resizable');
                });
            }

            function animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement) {
                var leftValue = e.pageX + xPosition - dragWidth;   
                //constrain the draggable element to move inside his container
                if(leftValue < minLeft ) {
                    leftValue = minLeft;
                } else if ( leftValue > maxLeft) {
                    leftValue = maxLeft;
                }

                var widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';
                
                jQuery('.draggable').css('left', widthValue).on("mouseup vmouseup", function() {
                    jQuery(this).removeClass('draggable');
                    resizeElement.removeClass('resizable');
                });

                jQuery('.resizable').css('width', widthValue); 

                updateLabel(labelResizeElement, resizeElement, 'left');
                updateLabel(labelContainer, resizeElement, 'right');
                dragging =  false;
            }

            function updateLabel(label, resizeElement, position) {
                if(position == 'left') {
                    ( label.offset().left + label.outerWidth() < resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
                } else {
                    ( label.offset().left > resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
                }
            }   



            // iterate both media sources
            Popcorn.forEach( videos, function( media, type ) {
                
                // when each is ready... 
                media.listen( "canplayall", function() {
                    
                    // trigger a custom "sync" event
                    this.emit("sync");
                    
                    // set the max value of the "scrubber"
               // scrub.attr("max", this.duration() );

                // Listen for the custom sync event...    
                }).listen( "sync", function() {
                    
                    // Once both items are loaded, sync events
                    if ( ++loadCount == 2 ) {
                        
                        // Iterate all events and trigger them on the video B
                        // whenever they occur on the video A
                        events.forEach(function( event ) {

                            videos.a.listen( event, function() {
                                
                                // Avoid overkill events, trigger timeupdate manually
                                if ( event === "timeupdate" ) {
                                    
                                    if ( !this.media.paused ) {
                                        return;
                                    } 
                                    videos.b.trigger( "timeupdate" );
                                    
                                    // update scrubber
                                    //scrub.val( this.currentTime() );
                                    
                                    return;
                                }
                                
                                if ( event === "seeking" ) {
                                    
                                    videos.b.currentTime( this.currentTime() );
                                }
                                
                                if ( event === "play" || event === "pause" ) {
                                    console.log(event);
                                    videos.b[ event ]();
                                }
                            });
                        });
                    }
                });
            });

            
            
            videos.a.loop( true );
            videos.b.loop( true );

            window.setTimeout(function() {

              videos.a.play();
              videos.b.play();

              

            }, 1000);
                

   			
        }

    }

    module.exports = VideoSlider || window.VideoSlider;

})();
