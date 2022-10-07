import mongoose from 'mongoose';

const caseModel = new mongoose.Schema({

  id_cases: {
    type: Number,
    requierd: true,
  },

    name: {
      type: String,
      requierd: true,
    },

    price: {
      type: Number,
      requierd: true,
    },

    priceSale: {
        type: Number,
    },

    image: {
        type: String,
        default: 'https://i.ibb.co/236JSxQ/the-recoil-case.png',
    },

    items: {
      type: [],
      default: []
    }
})

export default mongoose.model('CaseModel', caseModel)