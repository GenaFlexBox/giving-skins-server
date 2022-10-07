import ApiError from "../exceptions/api-error.js";
import caseModel from "../model/caseModel.js";

const URL = process.env.API_URL;

class CaseServices {

    async createCases(item) {
        const {id_cases, name, price, image, items} = item
        const candidate = await caseModel.findOne({name});

        if (candidate) {
          throw ApiError.BadRequest(`Кейс ${name} уже существует`)
        }

        const cases = await caseModel.create({id_cases, name, price, image, items});

        return {
            name,
            price,
            image,
            items
        }
    }

    async getAllCases() {
        const cases = await caseModel.find();
        return cases;
    }
}

export default new CaseServices();