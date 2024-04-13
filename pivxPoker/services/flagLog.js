const FlagLog = require('../models/flagLog');
const User = require('../models/user');

exports.logFlag = async (ip, userId, note) => {
  const user = await User.findById(userId);

  if (!user) return;

  const isExistTorIp = await TorIp.findOne({
    ip
  });

  if (!isExistTorIp) return;

  user.flagged = (user.flagged || 0) + 1;
  const flagLogFound = await FlagLog.findOne({
    user: user.id
  });

  const flagged = {
    flagNumber: user.flagged,
    note
  };
  const promises = [user.save()];

  if (flagLogFound) {
    flagLogFound.flags.push(flagged);
    promises.push(flagLogFound.save());
  } else {
    const flagLog = new FlagLog({
      user: user.id,
      flags: [flagged]
    });
    promises.push(flagLog.save());
  }

  await Promise.all(promises);
};
