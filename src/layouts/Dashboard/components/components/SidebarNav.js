import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const mock = [
  {
    groupTitle: '',
    id: 'quiz',
    pages: [
      {
        title: 'Quizzes',
        href: '/dashboard',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        ),
      },
      {
        title: 'Recordings',
        href: '/recordings',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
      },
    ],
  },
  // {
  //     groupTitle: 'Select tools',
  //     id: 'select-tools',
  //     pages: [
  //         {
  //             title: 'Payment systems',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //         {
  //             title: 'Invoices',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //         {
  //             title: 'Plans',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //         {
  //             title: 'Subscriptions',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //     ],
  // },
  // {
  //     groupTitle: 'Settings',
  //     id: 'settings',
  //     pages: [
  //         {
  //             title: 'System',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  //                     />
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //         {
  //             title: 'General',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //         {
  //             title: 'Security',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //         {
  //             title: 'Notifications',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //     ],
  // },
  // {
  //     groupTitle: 'Support',
  //     id: 'support',
  //     pages: [
  //         {
  //             title: 'Support',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //         {
  //             title: 'Announcements',
  //             href: '#',
  //             icon: (
  //                 <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     width={24}
  //                     height={24}
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                 >
  //                     <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth={2}
  //                         d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
  //                     />
  //                 </svg>
  //             ),
  //         },
  //     ],
];

const SidebarNav = () => {
  return (
    <Box padding={2}>
      {mock.map((item, i) => (
        <Box key={i} marginBottom={3}>
          <Typography
            variant="caption"
            color={'text.secondary'}
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: 1,
              display: 'block',
            }}
          >
            {item.groupTitle}
          </Typography>
          <Box>
            {item.pages.map((p, i) => (
              <Box marginBottom={1 / 2} key={i}>
                <Button
                  component={'a'}
                  href={p.href}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    color: 'text.primary',
                  }}
                  startIcon={p.icon || null}
                >
                  {p.title}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
      {/*<Button*/}
      {/*    variant="contained"*/}
      {/*    color="primary"*/}
      {/*    fullWidth*/}
      {/*    component="a"*/}
      {/*    href="#"*/}
      {/*    startIcon={*/}
      {/*        <svg*/}
      {/*            xmlns="http://www.w3.org/2000/svg"*/}
      {/*            width={20}*/}
      {/*            height={20}*/}
      {/*            viewBox="0 0 20 20"*/}
      {/*            fill="currentColor"*/}
      {/*        >*/}
      {/*            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />*/}
      {/*            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />*/}
      {/*        </svg>*/}
      {/*    }*/}
      {/*>*/}
      {/*    Contact us*/}
      {/*</Button>*/}
    </Box>
  );
};

export default SidebarNav;
