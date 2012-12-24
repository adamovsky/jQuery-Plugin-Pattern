
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
         
     debugger;
     args = $.extend({
                      "content" : "some random content",
                      "left" : leftHandler,
                      "right" : rightHandler
                     }, 
                     args);
                        
     content = args.content;
    
     this.version = "1.0";     
     
     this.content = contentFn;
     this.left = left;     
     this.render = render;
     this.right = right;

     function contentFn(str)
      {
       content = args.content = str;
       render();
      }
      
     function init()
      {
       render();
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
       debugger;
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
     
     init();
     
     return this;
    }

   //---------------------------------------------------------------------------------------------
   //
   // [PLUGIN CHAINING CODE]
   // This gets executed everytime the plugin gets instantiated.
   //

   function _(fn)      // local function that facilitates chainability
    {
     return function (args)
             {
              var self = this;
              
              return $selected.each(function () 
                                     {
                                      fn.call(self, args); 
                                     });
                                 
             };
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
   
   function initObject(instantiate, args)
    {
     var classKey,
         elementExists = false,
         matchCounter = 0, 
         x = 0,
         y = 0,
         jqCacheLength = jqCache.length,
         objectExists = false; 
         
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
   
     if (instantiate === true && objectExists === false)
      {
       classObject = new getPluginClass(this, args[0].properties || {});
              
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
        jqCache[jqCache.length - 1].config = getConfig();
       
       $.extend($.fn[pluginName], classObject);        
      }        
      
     return getConfig().chainable === true   // checks for chaining in main plugin
             ? this                          // returns chainability hook
             : classObject;                  // returns OOP object hook                           
    }
    
   function initPlugin(args)
    {
     var error,
         eventPool = args.pool,
         pluginVersion = args.version;
         
     pluginName = args.name; 

     try                                       // meat 
      {
       // Step 1: register plugin
       $.fn[pluginName] = function () 
                           {
                            // This gets called AFTER the init() and mainly is responsible for taking the
                            // arguments passed into a plugin call.
                            return initObject.apply(this, [true, arguments]);
                           };
                           
       // Step 2: intercept jquery init
       $.fn.extend({                            // now we overwrite jQuery's internal init() so we
                                                // can intercept the selector and context.
                    init: function( ) 
                           {
                            // When we call a plugin like $(selector).plugin(), this init() will be called
                            // BEFORE the above step 1 gets called.
                           
                            var selector = arguments[0],
                                context = arguments[1],
                                rootQuery = arguments[2],
                                
                                $this;
                                
                            classObject = null;
                            
                            pluginContext = context;
                            pluginSelector = selector;
                            
                            $this = new jqInit(selector, context, rootQuery);
                            
                            // The reason we need the following is to find if we already have an object
                            // for the given selector.  This will be necessary for syntax calls such 
                            // as $(selector).plugin.method() - in other words, where plugin does not
                            // take parenthesis.
                            
                            initObject.apply($this, [false, arguments]);
                             
                            return $this;
                           }
                   });

      }
     catch (error)
      {
       $(eventPool).trigger("error." + pluginName,
                            error);                           // in case something breaks let us know.
      }
    }

   var $selected,
       classObject, 
       jqInit = $.fn.init,
       jqCache = [],
       pluginContext,
       pluginName,
       pluginSelector;
           
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
   