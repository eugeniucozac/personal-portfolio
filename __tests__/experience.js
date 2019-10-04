const mongoose = require("mongoose");
const Experience = require("../models/Experience");

let experience;

beforeAll(() => {
  mongoose.Promise = global.Promise;
  mongoose.connect("mongodb://localhost:27017/eugeniucozac", {
    useNewUrlParser: true,
    useCreateIndex: true
  });
});

beforeEach(async () => {
  experience = new Experience();
  experience.title = "Front End Developer";
  experience.company = "LMAX Exchange";
  experience.details = "Lorem ipsum dolor sit amet, consectetur adipisg elit, se";
  experience.startDate = "2018-08-09";
  experience.endDate = "2019-08-09";
  experience = await experience.save();
});

afterEach(async () => {
  //cleanup
  await Experience.deleteMany({});
});

afterAll(done => {
  mongoose.disconnect(done);
});

describe("experience tests", () => {
  //insert tests
  test("create experience", async () => {
    const count = await Experience.countDocuments();
    expect(count).toBe(1);
  });

  test("read experience", async () => {
    const readExperience = await Experience.findById(experience.id);

    expect(readExperience.title).toBe(experience.title);
    expect(readExperience.company).toBe(experience.company);
    expect(readExperience.details).toBe(experience.details);
    expect(readExperience.startDate).toStrictEqual(experience.startDate);
    expect(readExperience.endDate).toStrictEqual(experience.endDate);
  });

  test("update experience", async () => {
    //update existing experience
    await Experience.updateOne(
      { _id: experience.id }, 
      { title: "Title modified", 
        company: "Company modified",
        details: "Details modified", 
        startDate: "2020-08-09",
        endDate: "2021-08-09" 
      });

    //read experience
    const readExperience = await Experience.findById(experience.id);
    expect(readExperience.title).toBe("Title modified");
    expect(readExperience.company).toBe("Company modified");
    expect(readExperience.details).toBe("Details modified");
    expect(readExperience.startDate).toBe("2020-08-09");
    expect(readExperience.endDate).toBe("2021-08-09"); 
  });

  test("delete experience", async () => {
    const count = await Experience.countDocuments();
    expect(count).toBe(1);

    await Experience.deleteOne({ _id: experience.id });

    const newCount = await Experience.countDocuments();
    expect(newCount).toBe(0);
  });
});
