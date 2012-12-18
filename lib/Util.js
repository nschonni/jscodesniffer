var CONSOLE_COLORS = {
        black: '0;30',
        dark_gray: '1;30',
        blue: '0;34',
        light_blue: '1;34',
        green: '0;32',
        light_green: '1;32',
        cyan: '0;36',
        light_cyan: '1;36',
        red: '0;31',
        light_red: '1;31',
        purple: '0;35',
        light_purple: '1;35',
        brown: '0;33',
        yellow: '1;33',
        light_gray: '0;37',
        white: '1;37'
    },

    util = {
        
     color: function( color, str ) {
         return CONSOLE_COLORS[ color ] ? 
             "\033[" + CONSOLE_COLORS[ color ] + "m" + str + "\033[0m" : 
             str;
     },
     
    /**
     * Replica of jQuery extend method
     *
     * @param object/array receiver
     * @param object/array obj
     * @return void
     */
    extend: function( receiver, obj ) {
        Object.keys( obj ).forEach(function( prop ){
            receiver[ prop ] = obj[ prop ];
        });
    },
    /**
     * Simplified replice of PHP sprintf.
     * It works only with %(n)s search pattern
     *
     * @param string template
     * @param mixed arg N
     * @return string
     */
    sprintf: function() {
        var re = /%\d*s/gm,
            args = Array.prototype.slice.apply( arguments ),
            tpl = args.shift(),
            matches = tpl.match( re ),
            repeatStr = function( str, repNum ) {
                var out = '', i = 1;
                for ( ; i <= repNum; i++ ) {
                    out += str;
                }
                return out;
            };

        if ( !matches ) {
            return tpl;
        }
        if ( args.length < matches.length ) {
            throw new Error( "Too few arguments" );
        }

        matches.forEach(function( match ){
            var repNum = match.replace( /\D/g, "" ),
                val = args.shift() + "";
            tpl = tpl.replace( /%\d*s/m,  repeatStr(" ", repNum - val.length) + val );
        });

        return tpl;
    },
    /**
     * Simplified replica of PHP wordwrap
     * 
     * @param string tr
     * @param int width
     * @return string
     */
    wordwrap: function( str, width ) {
        var words = str.split( " " ),
            i = 0, lines = [];

        width = width || 64;
        words.forEach(function( w ){
            if ( typeof lines[ i ] === "undefined" ) {
                lines[ i ] = "";
            }
            if ( lines[ i ].length < width ) {
                lines[ i ] += w + " ";
            } else {
                i++;
            }
        });
        return lines.join( "\n" );
    },
    /**
     * Replica of PHP var_dump()
     * Heavily based on http://www.openjs.com/scripts/others/dump_function_php_print_r.php
     * 
     * @param mixed data
     * @param int level
     * @return string
     */
    vardump: function ( data, level ) {
	var dumpText = "",
            level_padding = "",
            j = 0,
            prop,
            value;
            
	if ( !level)  level = 0;
	
	for ( ; j < level + 1; j++ ) {
            level_padding += "    ";
        } 
	if ( typeof( data ) === 'object' ) { //Array/Hashes/Objects 

            for ( prop in data ) {

                if ( data.hasOwnProperty(prop) ) {
                    value = data[ prop ];
                    if ( typeof( value ) === 'object' && value !== null ) { 
                        dumpText += level_padding + "" + prop + " ...\n";
                        dumpText += util.vardump( value, level + 1 );
                    } else {
                        if ( typeof value === "string" ) {
                            value = util.color( "yellow", "\"" + value + "\"" );
                        } else if ( value === null ) {
                            value = util.color( "blue", value );
                        } 
                        dumpText += level_padding + "" + prop + ": " + value + "\n";
                    }
                }
            }
	} else { //Stings/Chars/Numbers etc.
            dumpText = "===>" + data + "<===(" + typeof( data ) + ")";
	}
	return dumpText;
    }
   
}


module.exports = util;