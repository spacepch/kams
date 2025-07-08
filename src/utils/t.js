// src/services/permissionService.js

// 角色权限级别
const ROLE_LEVEL = {
  member: 1,
  admin: 2,
  lord: 3,
  'super-admin': 4
};

// 菜单项定义
const MENU_ITEMS = {
  VIEW_PROFILE: {
    label: '查看资料',
    roles: ['member', 'admin', 'lord', 'super-admin']
  },
  AT_USER: {
    label: '@ TA',
    roles: ['member', 'admin', 'lord', 'super-admin'],
    excludeSelf: true
  },
  ADD_FRIEND: {
    label: '添加好友',
    roles: ['member', 'admin', 'lord', 'super-admin'],
    excludeSelf: true
  },
  MUTE_USER: {
    label: '设置禁言',
    roles: ['admin', 'lord', 'super-admin'],
    minTargetLevel: 1, // 只能禁言普通成员
    maxTargetLevel: 1 // 只能禁言普通成员
  },
  REMOVE_USER: {
    label: '移出本群',
    roles: ['admin', 'lord', 'super-admin'],
    minTargetLevel: 1,
    maxTargetLevel: 1
  },
  SET_ADMIN: {
    label: '设为管理员',
    roles: ['lord', 'super-admin'],
    minTargetLevel: 1,
    maxTargetLevel: 1
  },
  REVOKE_ADMIN: {
    label: '撤销管理员',
    roles: ['lord', 'super-admin'],
    minTargetLevel: 2,
    maxTargetLevel: 2
  }
};

export default {
  /**
   * 获取用户可见的菜单项
   * @param {Object} currentUser - 当前操作者
   * @param {Object} targetUser - 目标用户
   * @param {Object} group - 群组信息
   * @returns {Array} 可见的菜单项列表
   */
  getVisibleMenuItems(currentUser, targetUser, group) {
    if (!group) return [];

    // eslint-disable-next-line no-unused-vars
    const currentLevel = ROLE_LEVEL[currentUser.role] || 0;
    const targetLevel = ROLE_LEVEL[targetUser.role] || 0;

    return Object.entries(MENU_ITEMS)
      .filter(([key, item]) => {
        // 检查当前用户是否有权限
        if (!item.roles.includes(currentUser.role)) return false;

        // 排除自身操作
        if (item.excludeSelf && currentUser.id === targetUser.id) return false;

        // 检查目标用户等级限制
        if (item.minTargetLevel && targetLevel < item.minTargetLevel) return false;
        if (item.maxTargetLevel && targetLevel > item.maxTargetLevel) return false;

        return true;
      })
      .map(([key, item]) => ({
        key,
        label: item.label,
        uid: targetUser.id,
        task: key.toLowerCase().replace(/_/g, '-')
      }));
  }
};
