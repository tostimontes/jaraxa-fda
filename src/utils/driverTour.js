import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const driverObj = driver({
  animate: false,
  showProgress: false,
  showButtons: ['next', 'previous', 'close'],
  steps: [
    {
      element: '#tour-example',
      popover: {
        title: 'Welcome to Jaraxa FDA Search',
        description:
          'Here you will be able to use de openFDA API to search for FDA registered drugs.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#search-medications',
      popover: {
        title: 'Simple Search',
        description: `Search any brand or generic name here, don't worry if you don't know how to spell it perfectly, our search algorithm helps you with typoes!`,
        side: 'bottom',
        align: 'start',
        onNextClick: async (element, step, options) => {
          window.setAdvancedSearch();
          driverObj.moveNext();
        },
      },
    },
    {
      element: '#advanced-toggle',
      popover: {
        title: 'Advanced Search',
        description:
          'Switch to Advanced Search here for more precise searches.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#advanced-search-form',
      popover: {
        title: 'Advanced Search',
        description:
          'Search by brand, manufacturer, or active ingredient, and filter by marketing status',
        side: 'bottom',
        align: 'start',
        onPrevClick: () => {
          window.setSimpleSearch();
          driverObj.movePrevious();
        },
        onNextClick: () => {
          window.setSimpleSearch();
          driverObj.moveNext();
        },
      },
    },
    {
      element: '#show-tour-button',
      popover: {
        title: 'Need help again?',
        description: 'Click the ? icon to show the site tour again!',
        side: 'top',
        align: 'start',
        onPrevClick: () => {
          window.setAdvancedSearch();
          driverObj.movePrevious();
        },
      },
    },
  ],
});

driverObj.drive();
