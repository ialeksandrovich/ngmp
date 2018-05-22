export class Parser {
    static parse( strData, strDelimiter ){
        strDelimiter = (strDelimiter || ",");
        let arrData = [[]];
        let arrMatches = null;
        let objPattern = new RegExp(
            (
                // Delimiter
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted field
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard field
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );

        while (arrMatches = objPattern.exec( strData )){
            let strMatchedDelimiter = arrMatches[ 1 ];
            let strMatchedValue;

            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ){
                arrData.push( [] );
            }

            if (arrMatches[ 2 ]){
                strMatchedValue = arrMatches[ 2 ];
            } else {
                strMatchedValue = arrMatches[ 3 ];
            }

            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        return( arrData );
    }

    static parseAsync = async ( strData, strDelimiter ) => {
        strDelimiter = (strDelimiter || ",");
        let arrData = [[]];
        let objPattern = new RegExp(
            (
                // Delimiter
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted field
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard field
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );
        let arrMatches = objPattern.exec( strData );

        function findMatches (matches){
            let strMatchedDelimiter = matches[ 1 ];
            let strMatchedValue;

            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ){
                arrData.push( [] );
            }

            if (matches[ 2 ]){
                strMatchedValue = matches[ 2 ];
            } else {
                strMatchedValue = matches[ 3 ];
            }

            arrData[ arrData.length - 1 ].push( strMatchedValue );
            arrMatches = objPattern.exec( strData );
            if (arrMatches) {
                setTimeout(() => findMatches(arrMatches), 0);
            }
        }

        await findMatches(arrMatches);

        return( arrData );
    }
}