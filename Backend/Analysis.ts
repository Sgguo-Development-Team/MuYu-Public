import fs from "fs";
import path from "path";

const Analysis: any = {
  Write(): void {
    fs.readFile(path.join(__dirname, "Counter.json"), (err, data) => {
      if (err) throw err;
      let content = JSON.parse(data.toString());
      content["全服功德"]++;
      console.log(content);
      fs.writeFile(
        path.join(__dirname, "Counter.json"),
        JSON.stringify(content),
        (err) => {
          if (err) throw err;
        }
      );
    });
  },
  Read(): any {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, "Counter.json")).toString()
    );
  },
};

export default Analysis;
