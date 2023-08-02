import Joi from 'joi';

const addAttributesToType = (scheme: any, avoidAtt: Array<string>, type: any) => {
    const attributes = Object.keys(scheme);
    attributes.forEach((att) => {
        if (!avoidAtt.includes(att) && scheme[att] !== undefined) {
            if (typeof scheme[att] === "boolean") type = type[att]();
            else if(Array.isArray(scheme[att])) type = type[att](...scheme[att])
            else if (typeof scheme[att] === "number") type = type[att](scheme[att]);
            else type = type[scheme[att]]();
        }
    });
    return type;
};

const getType = (scheme: any): Joi.AnySchema => {
    let type: any;
    if (scheme.type === "object") {
        const object: any = {};
        scheme.attributes.forEach((attribute: any) => {
            object[attribute.name] = getType(attribute);
        });
        type = Joi.object(object);
    } else if (scheme.type === "array") {
        const avoidAtt = ["type", "name", "items"];
        type = Joi.array().items(getType(scheme.items));
        type = addAttributesToType(scheme, avoidAtt, type);
    } else {
        const avoidAtt = ["name"];
        type = Joi;
        type = addAttributesToType(scheme, avoidAtt, type);
    }
    return type;
};

const validateJsonJoi = (body: any, jsonScheme: any): { check: boolean; error: any } => {
    const { error } = getType(jsonScheme).validate(body);
    return { check: !error, error: error?.details[0].message };
};
export default validateJsonJoi;