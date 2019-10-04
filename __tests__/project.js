const mongoose = require("mongoose");
const Project = require("../models/Project");

let project;

beforeAll(() => {
  mongoose.Promise = global.Promise;
  mongoose.connect("mongodb://localhost:27017/eugeniucozac", {
    useNewUrlParser: true,
    useCreateIndex: true
  });
});

beforeEach(async () => {
  project = new Project();
  project.title = "Eugeniu Cozac";
  project.viewproject = "http://eugenecozac.com/";
  project.viewgithub = "https://github.com/eugeniucozac";
  project.technologies = "NodeJS, Express, ES6";
  project.image = "proj1.jpg";
  project = await project.save();
});

afterEach(async () => {
  //cleanup
  await Project.deleteMany({});
});

afterAll(done => {
  mongoose.disconnect(done);
});

describe("project tests", () => {
  //insert tests
  test("create project", async () => {
    const count = await Project.countDocuments();
    expect(count).toBe(1);
  });

  test("read project", async () => {
    const readProject = await Project.findById(project.id);

    expect(readProject.title).toBe(project.title);
    expect(readProject.viewproject).toBe(project.viewproject);
    expect(readProject.viewgithub).toBe(project.viewgithub);
    expect(readProject.technologies).toStrictEqual(project.technologies);
    expect(readProject.image).toStrictEqual(project.image);
  });

  test("update project", async () => {
    //update existing experience
    await Project.updateOne(
      { _id: project.id }, 
      { title: "Title modified", 
        viewproject: "Viewproject modified", 
        viewgithub: "Viewgithub modified", 
        technologies: "AngularJS", 
        image: "proj2.jpg" 
      }
    );

    //read experience
    const readProject = await Project.findById(project.id);
    expect(readProject.title).toBe("Title modified");
    expect(readProject.viewproject).toBe("Viewproject modified");
    expect(readProject.viewgithub).toBe("Viewgithub modified");
    expect(readProject.technologies).toBe("AngularJS");
    expect(readProject.image).toBe("proj2.jpg");
  });

  test("delete project", async () => {
    const count = await Project.countDocuments();
    expect(count).toBe(1);

    await Project.deleteOne({ _id: project.id });

    const newCount = await Project.countDocuments();
    expect(newCount).toBe(0);
  });
});
