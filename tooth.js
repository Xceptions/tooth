(function () {

    'use strict';

    var $ = {
        about : {
            'builtby' : 'Exceptions',
            'version' : 'version 1.3'
        },

        get : function (params) {
            return new DOM(params);
        },
        set: function (tagName, attrs) {
            var element = document.createElement(tagName);
            var el = new DOM(element);
            if (attrs) {
                if (attrs.className) {
                    el.addClass(attrs.className);
                    delete attrs.className;
                }
                if (attrs.text) {
                    el.text(attrs.text);
                    delete attrs.text;
                }
                if (attrs.html) {
                    el.html(attrs.html);
                    delete attrs.html;
                }
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        el.attr(key, attrs[key]);
                    }
                }
            }
            return el;
        },
        Forms: function (formId) {
            return new Form(formId);
        },
        docready: function (fn) {
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', fn, false);
                //window.addEventListener('load', fn, false);
            }
            else if (document.attachEvent) {
                document.attachEvent('onreadystatechange', fn);
                //window.attachEvent('onload', fn);
            }
        }
    }

    var DOM = function (params) {
        /* ----------------------------------------------------------------
         * selector gets the parameter as an array and returns this as an
         * object
         * ----------------------------------------------------------------
         */
        var selector;
        var i;
        if (typeof params === 'string'){
            selector = document.querySelectorAll(params);
        } else if (params.length) {
            selector = params;
        } else {
            selector = [params];
        }
        this.length = selector.length;
        for (i=0; i<this.length; i++) {
            this[i] = selector[i];
        }
        return this;
    }
    /* =====================================================================
     * DOM PROTOTYPE FUNCTIONS
     * =====================================================================
     */
    DOM.prototype = {
        /* -----------------------------------------------------------------
         * Helper functions. only used inside the DOM prototype
         * -----------------------------------------------------------------
         */
        map: function (callbackfunc) {
            var results = [];
            var len;
            for (len = 0; len < this.length; len++) {
                results.push(callbackfunc.call(this, this[len], len));
            }
            return results;
        },
        retOp: function (callbackfunc) {
            this.map(callbackfunc);
            return this;
        },
        retVal: function (callbackfunc) {
            var m;
            m = this.map(callbackfunc);
            return m.length > 1 ? m : m[0];
        },
        /* -----------------------------------------------------------------
         * Actual DOM functions
         * -----------------------------------------------------------------
         */
        hide: function () {
            this.retOp(function (el) {
                el.style.display = 'none';
            });
            return this;
        },

        show: function () {
            this.retOp(function (el) {
                el.style.display = 'block';
            });
            return this;
        },

        html: function (htm) {
            if (typeof htm !== 'undefined') {
                this.retOp(function(el){
                    el.innerHTML = htm;
                });
                return this;
            } else {
                return this.retVal(function (el) {
                    return el.innerHTML;
                });
            }
        },

        text: function (txt) {
            if (typeof txt !== 'undefined') {
                this.retOp(function(el){
                    el.innerText = txt;
                });
                return this;
            } else {
                return this.retVal(function (el) {
                    return el.innerText;
                });
            }
        },

        val: function (setvalue) {
            // set the value attribute of the html element or returns it
            if (typeof setvalue !== 'undefined') {
                this.retOp(function (el) {
                    el.value = setvalue;
                });
                return this;
            } else {
                return this.retVal(function (el) {
                    return el.value;
                });
            }
        },

        addClass: function (classes) {
            var addedClass = '';
            var n;
            if(typeof classes !== 'string'){
                for(; n < classes.length; n++) {
                    addedClass += ' ' + classes[n];
                }
            } else {
                addedClass += ' ' + classes;
            }
            return this.retOp(function (el) {
                el.className += addedClass;
            });
        },

        removeClass: function (klass) {
            /* the 'if' function fixes IE8 bug of non-support for indexOf */
            if (typeof Array.prototype.indexOf !== 'function'){
                Array.prototype.indexOf = function(item){
                    for(var i =0; i < this.length; i++){
                        if (this[i] === item){
                            return i;
                        }
                    }
                    return -1;
                }
            }
            return this.retOp( function (el) {
                var cs = el.className.split(' ');
                var i;
                while ((i = cs.indexOf(klass)) > -1) {
                    cs = cs.slice(0, i).concat(cs.slice(++i));
                }
                el.className = cs.join(' ');
            });
        },

        attr: function (attr, val) {
            /* this is used to set an attr of a func to a particular value
               it works in hand with the set function of creation       */
            if (typeof val !== 'undefined') {
                return this.retOp(function (el) {
                    el.setAttribute(attr, val);
                });
            } else {
                return this.retVal(function (el) {
                    return el.getAttribute(attr);
                });
            }
        },
        /* appending and removing child nodes */
        append: function(el){
            return this.retOp(function(parEl, i){
                el.retOp(function(childEl){
                    if(i>0){
                        childEl = childEl.cloneNode(true);
                    }
                    parEl.appendChild(childEl);
                });
            });
        },
        remove: function () {
            return this.retOp(function (el) {
                return el.parentNode.removeChild(el)
            });
        },

        error: function( msg ) {
            throw new Error( msg );
        },
        on: function (evnt, fn) {
            /* test which of the event features exist before returning
               the right function */
            if (document.addEventListener) {
                return this.retOp(function(el){
                    el.addEventListener(evnt, fn, false);
                });
            } else if (document.attachEvent) {
                return this.retOp(function(el){
                    el.attachEvent('on' + evnt, fn);
                });
            } else {
                return this.retOp(function(el){
                    el['on' + evnt] = fn;
                });
            }
        },
        off: function (evnt, fn) {
            /* test which of the event features exist before returning
               the right function */
            if (document.removeEventListener) {
                return this.retOp(function(el){
                    el.removeEventListener(evnt, fn, false);
                });
            } else if (document.detachEvent) {
                return this.retOp(function(el){
                    el.detachEvent('on' + evnt, fn);
                });
            } else {
                return this.retOp(function(el){
                    el['on' + evnt] = null;
                });
            }
        }
    }
    /* =====================================================================
     * END OF DOM FUNCTIONS
     * =====================================================================
     * BEGINNING OF FORM FUNCTIONS
     * =====================================================================
     */

     var Form = function (formId) {
         this.form = document.forms[formId];
         this.fieldval = ''; //represents the value gotten from the field
         return this;
     }

     Form.prototype = {
         mapforms: function (formfunc) {
             var formresults = formfunc.call(this, this.form);
             return formresults;
         },
         validate_as_emailfield: function (fieldId) {
             var val;
             var fieldval;
             var tester;
             val = this.mapforms(function(el){
                 return el.elements[fieldId];
             });
             fieldval = val.value;
             var tester = /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/;
             return tester.test(fieldval);
         },
         error_on_emailfield: function (fieldId) {
             var val;
             val = this.mapforms(function(el){
                 return el.elements[fieldId];
             });
             val.value = 'please input your email correctly';
             document.getElementById(fieldId).style.color = 'red';
         }
     }

    /* =================== INITIALIZER ==================================== */
    if (!window.$) {
        window.$ = $;
    }
    /* =============== * END INITIALIZER * ================================ */
})();
