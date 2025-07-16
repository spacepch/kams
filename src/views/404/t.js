const groupMsg = {
  'group-4': {
    name: 'global2',
    id: 'group-4',
    isMute: false,
    muteMembers: [],
    messages: []
  },
  'group-6': {
    name: 'global4',
    id: 'group-6',
    isMute: false,
    muteMembers: [],
    messages: [
      {
        id: 'Bcouqs5ssy9yit5w7tip7',
        role: 'user-1',
        isGroup: true,
        content: '大家好',
        date: '2025-07-05T19:19:22.523Z',
        replyMsg: null
      },
      {
        id: 'f3Jbp83r5M3V9MCDD9ep8',
        role: 'user-2',
        isGroup: true,
        content: '你好群组@user-1 ',
        date: '2025-07-05T19:19:33.838Z',
        replyMsg: null
      }
    ]
  }
};

const memberList = [
  {
    id: 'user-1',
    role: 'admin'
  },
  {
    id: 'user-11',
    role: 'lord'
  },
  {
    id: 'user-super-admin',
    role: 'super-admin'
  },
  {
    id: 'user-2',
    role: 'member'
  }
];

const userList = [
  {
    name: 'u1',
    id: 'user-1',
    numId: '1',
    age: '1',
    sex: '男',
    avatar: 'https://k.hotaru.icu/api/data/avatar/u1',
    groups: [
      {
        id: 'group-1',
        role: 'lord'
      },
      {
        id: 'group-2',
        role: 'lord'
      },
      {
        id: 'group-3',
        role: 'member'
      },
      {
        id: 'group-123',
        role: 'admin'
      }
    ],
    friends: []
  },
  {
    name: 'u2',
    id: 'user-2',
    numId: '2',
    age: '2',
    sex: '女',
    avatar: 'https://k.hotaru.icu/api/data/avatar/u2',
    groups: [
      {
        id: 'group-6',
        role: 'member'
      },
      {
        id: 'group-123',
        role: 'member'
      }
    ],
    friends: []
  }
];

const groupList = [
  {
    id: 'group-2',
    name: 'g2',
    lord: 'user-1',
    avatar: 'https://k.hotaru.icu/api/data/avatar/g2',
    admins: [],
    members: [
      {
        id: 'user-1',
        role: 'lord'
      },
      {
        id: 'user-super-admin',
        role: 'super-admin'
      }
    ]
  },
  {
    id: 'group-3',
    name: 'global',
    lord: 'user-1',
    avatar: 'https://k.hotaru.icu/api/data/avatar/global',
    admins: [],
    members: [
      {
        id: 'user-1',
        role: 'lord'
      },
      {
        id: 'user-super-admin',
        role: 'super-admin'
      }
    ]
  }
];

const groupMsg = {
  name: 'tt',
  id: 'group-tt',
  isMute: false,
  muteMembers: ['user-t3'],
  messages: [
    {
      id: 'WWzi1OHDHeRm-p0XgVHr1',
      role: 'user-t2',
      isGroup: true,
      content: '1',
      date: '2025-07-13T20:19:29.393Z',
      replyMsg: null
    }
  ]
};
