

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



    public static arrayHasDuplicates(array: string[]): boolean {

        let valuesSoFar = Object.create( null );

        for ( let i = 0; i < array.length; ++i ) {
            const value = array[i];

            if ( value in valuesSoFar ) return true;

            valuesSoFar[ value ] = true;
        }

        return false;
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



    public static parsePropertyValueBasedOnDataType( propertyValue: any, dataType: number): any {

        let value: any = null;


        switch ( dataType ) {

            case DataTypes.TEXT :

                value = propertyValue.toString();

                break;

            case DataTypes.NUMBER :

                value = parseInt( propertyValue );

                break;

            case DataTypes.LOOKUP :

                value = propertyValue.toString();

                break;

            case DataTypes.DATE :

                if ( propertyValue ) value = new Date( propertyValue );

                break;

            case DataTypes.BOOLEAN :

                value = JSON.parse( propertyValue );

                break;

            default :
                break;
        }


        return value;

    }
}