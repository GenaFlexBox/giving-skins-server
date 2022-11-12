import generateCase from "../data/generate-box.js";
import ApiError from "../exceptions/api-error.js";
import caseModel from "../model/caseModel.js";
import userSteam from "../model/userSteam.js";

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

    async getCase(id) {
        const cases = await caseModel.findOne({id_cases: id});

        if (!cases) {
            throw ApiError.BadRequest(`Такого кейса нет`)
        }
        return cases;
    }

    async openCase(user, id) {

        const persona = await userSteam.findOne({steamID: user});
        const cases = await caseModel.findOne({id_cases: id});

        if (!persona && !cases) {
            throw ApiError.BadRequest(`Ошибка`);
        } else if (!persona) {
            throw ApiError.BadRequest(`Ошибка`);
        } else if (!cases) {
            throw ApiError.BadRequest(`Ошибка`);
        }

        const personaBalance = persona.chips;
        const casesPrice = cases.price;
        const casesItem = cases.items
    
        if (personaBalance < casesPrice) {
            throw ApiError.BadRequest(`Недостаточно средств`);
        }

        const box = await generateCase(casesItem);
        const payCases = await userSteam.updateOne({steamID: user}, {$inc: {"chips": -casesPrice}});
        const openCases = await caseModel.updateOne({id_cases: id}, {$inc: {"openCase": 1}});
        const quotaCases = await caseModel.updateOne({id_cases: id}, {$inc: {"quota": -1}});
        const getItem = await userSteam.updateOne({steamID: user}, {$push: {inventarySite: box.prize}});
        return {
            payCases,
            box: box.prizeBox
        }
    }
}

export default new CaseServices();