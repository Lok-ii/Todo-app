const readline = require("readline");
const fs = require("fs");
const { log } = require("console");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const todoFilePath = "todo.txt";

const addNewTask = () => {
  rl.question("Enter task description: ", (input) => {
    const taskToAdd = input;
    fs.readFile(todoFilePath, (err, data) => {
      if (err) {
        log("Error reading file: ", err);
        return;
      }
      log(data);
      const tempList = data.toString().trim().split("\n");
      const list = tempList.filter((item) => item !== "");
      log(list, list.length);
      const newTask = `${list.length + 1}. ${taskToAdd} - incomplete\n`;
      fs.appendFile(todoFilePath, newTask, (err) => {
        if (err) {
          log("Error writing to file: ", err);
          return;
        }
        log("Task added successfully.");
        takeInput();
      });
    });
  });
};

const displayTasks = () => {
  fs.readFile(todoFilePath, (err, data) => {
    if (err) {
      log(err);
      return;
    }
    log(data.toString());
    takeInput();
  });
};

const markAsCompleted = () => {
  rl.question(
    "Please enter the number of the task you want to complete: ",
    (indexStr) => {
      let index = parseInt(indexStr);
      fs.readFile(todoFilePath, (err, data) => {
        if (err) {
          log(err);
          return;
        }
        let tasks = data.toString().trim().split("\n");
        tasks = tasks.map((task, idx) => {
          if (idx === index - 1) {
            const startIdx = task.indexOf(" - incomplete");
            if (startIdx !== -1) {
              const updatedTask = task.substring(0, startIdx) + " - completed";
              return updatedTask;
              log("Marked as completed");
            } else {
              log("not a valid task number or already completed");
            }
          }
          return task;
        });
        const updatedData = tasks.join("\n");
        fs.writeFile(todoFilePath, updatedData, (err) => {
          if (err) {
            log(err);
            return;
          }
          takeInput();
        });
      });
    }
  );
};

const removeTask = () => {
  rl.question(
    "Please enter the number of the task you want to remove: ",
    (indexStr) => {
      let index = parseInt(indexStr);
      fs.readFile(todoFilePath, (err, data) => {
        if (err) {
          log(err);
          return;
        }
        let tasks = data.toString().trim().split("\n");
        log(tasks);
        const updatedTasks = tasks.filter((task, idx) => idx !== index - 1);
        const updatedData = updatedTasks.join("\n");
        fs.writeFile(todoFilePath, updatedData, (err) => {
          if (err) {
            log(err);
            return;
          }
          log(`Removed task ${index} successfully.`);
          takeInput();
        });
      });
    }
  );
};

const takeInput = () => {
  const optionsList = `\n1. Add a new task\n2. View tasks\n3. Mark a task as complete\n4. Remove a task\n5. Exit`;
  log(optionsList);
  rl.question("Choose an option: ", (input) => {
    const option = parseInt(input);

    switch (option) {
      case 1:
        addNewTask();
        break;
      case 2:
        displayTasks();
        break;
      case 3:
        markAsCompleted();
        break;
      case 4:
        removeTask();
        break;
      case 5:
        process.exit();
        // rl.close();
        break;
      default:
        log("Please Choose a Valid Option");
        takeInput();
    }
  });
};

takeInput();
