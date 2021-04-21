const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  async index(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      // Somando a quantidade de status e armazenando no statusCount
      statusCount[status] += 1;

      // Total de horas por dia em cada job em progresso
      jobTotalHours = status == "progress" ? jobTotalHours + Number(job["daily-hours"])
        : jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    // Qtd horas que quero trabalhar - horas exigidas pelos jobs em progresso
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      profile: profile,
      jobs: updatedJobs,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
