

import {SearchConditionTypes} from "../constants/SearchConditionTypes";
import {DataTypes} from "../constants/DataTypes";

export class ObjectSearchHelper {

    constructor() {

    }



    public static generateQueryFromSearchConditions(searchConditions: any): any {
        let query = {};

        const { types } = searchConditions;
        const { conditions } = searchConditions;

        if ( ! conditions.length ) {

            if ( types.length === 1 ) {

                query[ "type" ] = types[0];

            } else if ( types.length > 1 ) {

                query[ "type" ] = { $in: types };
            }

        } else {

            query[ "$and" ] = [];

            query[ "$and" ].push( { type: { $in: types } } );

            for ( let condition of conditions ) {

                switch ( condition.operator ) {

                    case SearchConditionTypes.EQUAL :

                        if ( condition.dataType === DataTypes.DATE ) {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: new Date( condition.value ) } }
                                }

                            );

                        } else if ( condition.dataType === DataTypes.TEXT ) {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value:  { $regex: new RegExp( "^" + condition.value.toLowerCase() ),$options: "i" } } }
                                }

                            );

                        } else {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value:  condition.value } }
                                }

                            );

                        }

                        break;


                    case SearchConditionTypes.NOT_EQUAL :

                        if ( condition.dataType === DataTypes.DATE ) {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $ne: new Date( condition.value ) } } }
                                }

                            );

                        } else {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $ne: condition.value } } }
                                }

                            );

                        }

                        break;


                    case SearchConditionTypes.CONTAINS :

                        query[ "$and" ].push(
                            {
                                "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $regex : ".*" + condition.value + ".*", $options: "i"} } }
                            }

                        );

                        break;


                    case SearchConditionTypes.DOES_NOT_CONTAIN :

                        query[ "$and" ].push(
                            {
                                "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $regex : "^((?!" + condition.value +").)*$", $options: "i" } } }
                            }

                        );

                        break;


                    case SearchConditionTypes.LESS_THAN :

                        if ( condition.dataType === DataTypes.DATE ) {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $lt : new Date( condition.value ) } } }
                                }
                            );

                        } else {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $lt : condition.value } } }
                                }

                            );

                        }

                        break;


                    case SearchConditionTypes.LESS_THAN_OR_EQUAL :

                        if ( condition.dataType === DataTypes.DATE ) {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $lte : new Date( condition.value ) } } }
                                }

                            );

                        } else {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $lte : condition.value } } }
                                }

                            );

                        }

                        break;


                    case SearchConditionTypes.GREATER_THAN :

                        if ( condition.dataType === DataTypes.DATE ) {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $gt : new Date( condition.value ) } } }
                                }

                            );

                        } else {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $gt : condition.value } } }
                                }

                            );

                        }

                        break;


                    case SearchConditionTypes.GREATER_THAN_OR_EQUAL :

                        if ( condition.dataType === DataTypes.DATE ) {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $gte : new Date( condition.value ) } } }
                                }

                            );

                        } else {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $gte : condition.value } } }
                                }

                            );

                        }

                        break;


                    case SearchConditionTypes.STARTS_WITH :

                        query[ "$and" ].push(
                            {
                                "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $regex : `^(${condition.value}).+`, $options: "i" } } }
                            }

                        );

                        break;


                    case SearchConditionTypes.DOES_NOT_START_WITH :

                        query[ "$and" ].push(
                            {
                                "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $regex : `^(?!${condition.value}).+`, $options: "i" } } }
                            }

                        );

                        break;


                    case SearchConditionTypes.IS_EMPTY :

                        query[ "$and" ].push(
                            {
                                "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $in: [ null, "" ] } } }
                            }
                        );

                        break;


                    case SearchConditionTypes.IS_NOT_EMPTY :

                        query[ "$and" ].push(
                            {
                                "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $nin: [ null, "" ] } } }
                            }
                        );

                        break;

                    case SearchConditionTypes.ONE_OF :

                        if ( ! condition.value || ! condition.value.length ) break;


                        if ( condition.dataType === DataTypes.DATE ) {

                            let dates: Date[] = [];

                            for ( let date of condition.value ) {

                                dates.push( new Date( date ) );

                            }

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $in: dates } } }
                                }
                            );

                        } else {

                            query[ "$and" ].push(
                                {
                                    "properties": { $elemMatch: { propertyDef: condition.propertyDef, value: { $in: condition.value } } }
                                }
                            );

                        }

                        break;

                    default :
                        break;

                }
            }
        }


        return query;
    }

}