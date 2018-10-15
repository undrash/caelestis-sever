



import {DataTypes} from "../constants/DataTypes";

export class ValidationHelper {

    constructor() {

    }


    public static isObjectIdValid(id: string): boolean {

        return /^[a-fA-F0-9]{24}$/.test( id );

    }


    public static arrayContainsArray(superSet: any[], subSet: any[]): boolean {
        if ( 0 === subSet.length ) {
            return false;
        }

        return subSet.every(function (value) {
            return ( superSet.indexOf(value) >= 0 );
        });
    }


    public static validatePropertyValueForDataType( propertyValue: any, dataType: number): boolean {

        let isValid = false;

        switch ( dataType ) {

            case DataTypes.TEXT :

                isValid = true;

                break;

            case DataTypes.NUMBER :

                isValid = ! isNaN( propertyValue );

                break;

            case DataTypes.LOOKUP :

                isValid = this.isObjectIdValid( propertyValue );

                break;

            case DataTypes.DATE :

                isValid = new Date( propertyValue ).toDateString() !== "Invalid Date";

                break;

            case DataTypes.BOOLEAN :

                isValid = propertyValue === false || propertyValue === true;

                break;

            default :
                break;
        }


        return isValid;

    }
}