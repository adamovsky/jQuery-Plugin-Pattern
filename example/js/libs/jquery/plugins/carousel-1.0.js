var xyz = false;

 (function($, config)
  {
   //---------------------------------------------------------------------------------------------
   //
   // [PLUGIN CLASS CODE]
   // This is the meat of the plugin.  It is the class that gets instantiated.  
   //
   function getPluginClass($this, args)
    {
     // notice that in our pattern we use $this to refer to what in the traditional
     // plugin pattern would be this - in both cases it is the jquery object matched
     // by the selector on which the plugin is run.
    
     var content;  // this is needed in case we create new jquery objects within the plugin code
     /*    
     if (!$this)
      {
       $this = $self;
      }
    */
     var self = this;
     
     args = $.extend({
                      "content" : "some random content",
                      "left" : leftHandler,
                      "right" : rightHandler
                     }, 
                     args);
                        
     content = args.content;
    
     this.message = "No message found";
     this.version = "1.0";     
     
     this.content = contentFn;
     this.getMessage = getMessage;        
     this.init = init;
     this.left = left;  
     this.render = render;
     this.right = right;
     this.setMessage = setMessage;     

     // The following getter/setter are supposed to show state memory of the pattern
     function getMessage()
      {
       console.log(this.message);
      }

     function setMessage(msg)
      {
       console.log ('  SET MESSAGE : ', msg, ' - this: ', this);
       //debugger;
       this.message = msg;
      }
  
     function contentFn(str)
      {
       content = args.content = str;
       render();
      }
      
     function init($)
      {
       $this = $;
      // debugger;
       this.render();
      }
      
     function left(args)
      {
       if (typeof args === 'function')
        leftHandler(args);
        
       $(".left", $this).trigger("click"); 
      }
      
     function leftHandler(args)
      {
       var callback = typeof args === 'function'
                       ? args
                       : function (e)
                          {
                           e.preventDefault();
                           
                           $(this).parent().find(".content").html("left clicked"); 
                          };
                          
       $(".left", $this).on("click",
                            callback);
      }
                
     function render(args)
      {
       var $jq,
           template = args ||'<a href="" class="left">\
                                left\
                              </a>\
                              <a href="" class="right">\
                                right\
                              </a>\
                              <div class="container">\
                                <div class="content">'
                                  + content +
                               '</div>\
                              </div>';
                        
       $jq = $this.each(function ()
                         {
                          $(this).html(template);
                         });
                         
       leftHandler();
       rightHandler();
       
       return $jq;
      }
     
     function right(args)
      {
       if (typeof args === 'function')
        rightHandler(args);
        
       $(".right", $this).trigger("click"); 
      }
      
     function rightHandler(args)
      {
       var callback = typeof args === 'function'
                       ? args
                       : function (e)
                          {
                           e.preventDefault();
                           
                           $(this).parent().find(".content").html("right clicked"); 
                          };
                          
       $(".right", $this).on("click",
                             callback);
      }
    
  //  You should NOT run any code from within your class.  Have the init() function contain all the 
  //  logic you want to execute by default. 
  //   init();
     
     return this;
    }

   //---------------------------------------------------------------------------------------------
   //
   // [PLUGIN CONFIG CODE]
   // This gets executed everytime the plugin gets instantiated.
   //

   // getConfig - always used to contain class/plugin arguments
   function getConfig()
    {
     return {};       // we define this via setConfig()
    }

   // initConfig - sets default values via jQuery's extend()
   function initConfig(args)
    { 
     setConfig($.extend({
                         chainable : true,     // false - this allows us to do something like $(...).plugin(args).method()
                                               //         this returns the object as the output
                                               // true  - otherwise, by default, it will assume jQuery native functionality of chainability
                                               //         this returns what jQuery expects for chaining
                         properties : {}       // any properties that you want to be passed to the plugin.
                        }, 
                        args));
    }
   
   // setConfig - always used to set class/plugin arguments, usually used indirectly via initConfig
   function setConfig(args)
    {
     getConfig = function()
                  {
                   return args;
                  };
    }      
    
   //---------------------------------------------------------------------------------------------
   //
   // [PLUGIN INIT CODE]
   // This gets executed only once per plugin as all it takes care of is the actual initialization
   // of the plugin
   //
   
   function initObject(pluginName, instantiate, args)
    {
     var classKey,
         classObject,
         elementExists = false,
         err,
         matchCounter = 0, 
         prop,
         x = 0,
         y = 0,
         jqCacheLength = jqCache.length,
         objectExists = false; 
         
     // We need this line so that the class can populate its $this in methods that are part of 
     // a singleton class.
     //$self = this;
                          
     if (jqCacheLength > 0)
      this.each(function (index, element)
                 {
                  var matchedElements = 0;
                  
                  while (x < jqCacheLength) 
                  { 
                   matchedElements = jqCache[x].elements.length;
                   for (; y < matchedElements; y++)
                    {
                     if (element == jqCache[x].elements[y])
                      {
                       matchCounter++;    
                       elementExists = true;
                       
                       break;
                      }
                     else if (y >= matchCounter)
                      {
                       y = 0;
                       break;
                      }
                    }
                   if (matchCounter === matchedElements)
                    {
                     classObject = jqCache[x].object;
                     
                     initConfig(jqCache[x].config);
                     
                      objectExists = true;
                    }
                        
                   if (elementExists === true)
                    break;
                 
                   x++;
                  }
                 });
                 
     if (instantiate === false && objectExists === false)
      {
       if (args.callee.caller.caller == null)
        {
         classObject = new getPluginClass(this,
                                          {});
        
         // We need to make this non-chainable to expose the class object since we know we
         // will not jQuery chain it (since it will be $(selector).plugin.method())
         initConfig({
                     "chainable" : false
                    }),
         
         classObject.init(this);
         
         jqCache.push({ 
                       // "config" : {}, // this gets set AFTER the classObject is resolved
                       "elements" : this, 
                       "object" : classObject 
                      });
         
         jqCache[jqCache.length - 1].config = getConfig();
      
        }
      }                             
     else if (instantiate === true && objectExists === false)
      {
       classObject = new getPluginClass(this, args[0] && args[0].properties || {});
              
       jqCache.push({ 
                     // "config" : {}, // this gets set AFTER the classObject is resolved
                     "elements" : this, 
                     "object" : classObject 
                    });
                                
       // We can't do something like this $this.data('plugin', classObject); since jQuery
       // doesn't allow us to store classObject in data()
       
      }
      
     if (classObject)
      {
       // If we do not instantiate then we do not want to initConfig as it will mess up the
       // default config values.
       if (instantiate === true)
        initConfig(args[0]),
        jqCache[jqCache.length - 1].config = getConfig(),
        classObject.init(this);
       
       // If we use the $.extend() method what will happen is it will do a shallow copy of the object and 
       // apply it to the prototype as a copy.
       // This means if it's a copy we're not dealing with the real object from the jqCache, so any changes
       // we make to the members will not stay and thus the state is lost.
       // So what we do here is intercept the object's interface to bind it to the corresponding object
       // since what we are doing is essentially what $.extend() does except we're not just copying it,
       // we're copying over the interface, but adding plumbing to rewire 'this' to be the object. 
       // So do NOT use this $.extend($.fn[pluginName].constructor.prototype, classObject); to extend
       // your class - it will just make a copy that will effectively lose state.

       for (prop in classObject) 
        {
         // We do not want to waste time with trying to intercept functions that are inherited. However
         // if this is something that you do want, you may want to edit this piece of code.  Usually this
         // is not needed.  Be careful not just to remove this piece of code, as removing it will cause
         // for all kinds of functions to try to be intercepted which we're not interested in.
         if (!classObject.hasOwnProperty(prop)) 
          continue; 
          
         if (typeof classObject[prop] == 'function') 
          {
           $.fn[pluginName].constructor.prototype[prop] = (function (prop)
                                                            {
                                                             return function (args) 
                                                                     {
                                                                      classObject[prop].apply(classObject, arguments);
                                                                     };
                                                            })(prop);
          }              
         /*
         // IMPORTANT NOTICE:                                
         // This whole else block is commented out since we should usually not want users to access
         // properties directly such as $(selector).plugin.property = "xxx";  If you want your plugin
         // to allow this feel free to uncomment this block.
         //
         // If you unblock it, it can still serve as a good way to allow users to quickly access the
         // property for read-only purposes on all browsers (even those that do not support the
         // __defineGetter__ and __defineSetter__).  On most modern browsers uncommenting this would
         // allow direct read/write access to the properties.
         else
          {
           
           // Since IE doesn't have good support for defining getter and setters, we have to wrap
           // this in a try/catch.  This means that in IE we will not be able to do something like
           // this $(selector).plugin.property = value; and expect it to keep state from instance
           // to instance since it's a shallow copied property.  In browsers where we can define
           // getters and setters we can directly access the properties.  The argument can be made
           // that this is actually a feature since in proper OOP one should never access a property
           // directly, so you should actually have a getter/setter method that would it access the
           // given property - such as $(selector).plugin.getProperty(); 
           
           try 
            {
             $.fn[pluginName].constructor.prototype.__defineSetter__(prop, 
                                                                     (function(prop)
                                                                       {
                                                                        return function(val)
                                                                                {
                                                                                 classObject[prop] = val;
                                                                                };
                                                                       })(prop));
                                                                            
             $.fn[pluginName].constructor.prototype.__defineGetter__(prop, 
                                                                     (function(prop)
                                                                       {
                                                                        return function()
                                                                                {
                                                                                 return classObject[prop];
                                                                                };
                                                                       })(prop));
             }
            catch (err)
             {                                                        
              $.fn[pluginName].constructor.prototype[prop] = classObject[prop];
             }
          }
          */
        }
       
      }        
      
     // We need this line so that the class can populate its $this in methods that are part of 
     // a singleton class.
     $self = this;
   
     return getConfig().chainable === true   // checks for chaining in main plugin
             ? this                          // returns chainability hook
             : classObject;                  // returns OOP object hook                           
    }
    
   function initPlugin(args)
    {
     var error,                          // We need to localize error so it doesn't leak into global namespace
         eventPool = args.pool,          // This is our event pool localized to reduce chain lookup where applicable
         pluginName = args.name,         // This is our plugin name localized to reduce chain lookup where applicable
         pluginVersion = args.version;   // This is our plugin version  localized to reduce chain lookup where applicable
        
     // Anything could go wrong in the initialization phase of the plugin so we wrap it in a try/catch.  Most likely
     // nothing will go wrong so if you don't want the overhead of the try/catch you can simply comment it out - at
     // your own risk. 
     try 
      {
       // Here we are simply registering the plugin to jQuery's prototype - ahem, plugin registry.
       $.fn[pluginName] = function () 
                           {
                            // This gets called AFTER the init() and mainly is responsible for taking the
                            // arguments passed into a plugin call via syntax $(selector).plugin(args)
                            
                            return initObject.apply(this, [pluginName, true, arguments]);
                           };
                        
       // Here begins some of the black magic.  We want to override jQuery's init function so we can intercept
       // any selectors.  This will be important when we will want to dynamically override a plugin's instance's
       // prototype as to allow dot notation (e.g. $(selector).plugin.method()).  This will ESPECIALLY be 
       // important for uninitialized plugins - or in other words that never get called via the standard syntax
       // of $(selector).plugin() at least once (notice the parenthesis).
       $.fn.init = function () 
                             {
                              var selector = arguments[0],
                                  context = arguments[1],
                                  rootQuery = arguments[2],
                                  $this = new jqInit(selector, context, rootQuery);
                            
                              $self = $this;
                              
                            //  console.log("resolve (", selector, ")");
                            
                              // The reason we need the following is to find if we already have an object
                              // for the given selector.  This will be necessary for syntax calls such 
                              // as $(selector).plugin.method() - in other words, where plugin does not
                              // take parenthesis.
                              initObject.apply($this, [pluginName, false, arguments]);
                               
                              // Do not forget to return the selected element stack!
                              return $this;
                             };
                 
                   

      }
     catch (error)
      {
       $(eventPool).trigger("error." + pluginName,
                            error);                // in case something breaks let us know via a namespaced event
      }
    }

   var $self, // this is a weird one.  We have to have it here for uninstantiated $(selector).plugin.method() syntax
    
       jqInit = $.fn.init,  // We need to capture a reference to jQuery's init function since we will override it.
       jqCache = [];        // This is our instance registry that contains all our plugin instances.
           
   initPlugin({
               "name" : config.name || "unknown",  // plugin name 
               "pool" : config.pool || document    // event pool
              });    
              
   //---------------------------------------------------------------------------------------------    
  })(jQuery, 
     {      
      "name" : "carousel",
      "pool" : document
     });
   