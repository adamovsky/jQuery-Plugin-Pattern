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
         
     if (!$this)
      {
     //  debugger;
       $this = $self;
      }
      
     args = $.extend({
                      "content" : "some random content",
                      "left" : leftHandler,
                      "right" : rightHandler
                     }, 
                     args);
                        
     content = args.content;
    
     this.version = "1.0";     
     
     this.content = contentFn;
     this.init = init;
     this.left = left;     
     this.render = render;
     this.right = right;

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
   
   function initObject(instantiate, args)
    {
     var classKey,
         elementExists = false,
         matchCounter = 0, 
         x = 0,
         y = 0,
         jqCacheLength = jqCache.length,
         objectExists = false; 
         
     // We need this line so that the class can populate its $this in methods that are part of 
     // a singleton class.
     $self = this;
                              
  //   console.log('  initObject - instantiate: ', instantiate, ' args: ', args, ' stack: ', this, ' - $self: ', $self);
     
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
        // debugger;
        
         // We need to make this non-chainable to expose the class object since we know we
         // will not jQuery chain it (since it will be $(selector).plugin.method())
         initConfig({
                     "chainable" : false
                    }),
         
         classObj.init(this);
         
         jqCache.push({ 
                       // "config" : {}, // this gets set AFTER the classObject is resolved
                       "elements" : this, 
                       "object" : classObj 
                      });
         
         jqCache[jqCache.length - 1].config = getConfig();
                      
         $.extend($.fn[pluginName].constructor.prototype, classObj);
         
         classObject = classObj;
         debugger;
        }
 //      debugger;
      }                             
     else if (instantiate === true && objectExists === false)
    // if (this.length > 0 && objectExists === false)
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
       
       $.extend($.fn[pluginName].constructor.prototype, classObject); 
              
      }        
      
     return getConfig().chainable === true   // checks for chaining in main plugin
             ? this                          // returns chainability hook
             : classObj || classObject;                  // returns OOP object hook                           
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
       
       classObj = new getPluginClass(args[0] && args[0].properties || {});
       
       $.fn[pluginName] = function () 
                           {
                            debugger;
                            // This gets called AFTER the init() and mainly is responsible for taking the
                            // arguments passed into a plugin call.
                            return initObject.apply(this, [true, arguments]);
                           };
                        
       $.extend($.fn[pluginName].constructor.prototype, classObj);
      
       // Step 2: intercept jquery init
       $.fn.extend({ 
                   "init" : function () 
                             {
                              // When we call a plugin like $(selector).plugin(), this init() will be called
                              // BEFORE the above step 1 gets called.
                             
                              var selector = arguments[0],
                                  context = arguments[1],
                                  rootQuery = arguments[2];
                                  
                            //      $this;
                                  
                              classObject = null;
                              
                              pluginContext = context;
                              pluginSelector = selector;
                              
                              $self = new jqInit(selector, context, rootQuery);
                            
                              // The reason we need the following is to find if we already have an object
                              // for the given selector.  This will be necessary for syntax calls such 
                              // as $(selector).plugin.method() - in other words, where plugin does not
                              // take parenthesis.
                              
                           //   console.log('selector: ', selector, ' context: ', context, ' stack: ', $self);
                           
                            //  debugger;
                              initObject.apply($self, [false, arguments]);
                               
                              
                              return $self;
                             }
                   });
                   

      }
     catch (error)
      {
       $(eventPool).trigger("error." + pluginName,
                            error);                           // in case something breaks let us know.
      }
    }

   var $self, // this is a weird one.  We have to have it here for uninstantiated $(selector).plugin.method() syntax
       classObj,
       classObject, 
       jqInit = $.fn.init,
       jqCache = [],
       pluginContext,
       pluginName,
       pluginSelector;
           
     //      debugger;
           
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
   