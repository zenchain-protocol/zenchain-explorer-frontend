import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode, getColor } from '@chakra-ui/theme-tools';

import getDefaultFormColors from './getDefaultFormColors';
import getDefaultTransitionProps from './getDefaultTransitionProps';

export default function getOutlinedFieldStyles(props: StyleFunctionProps) {
  const { theme, borderColor } = props;
  const { focusBorderColor, errorColor } = getDefaultFormColors(props);
  const transitionProps = getDefaultTransitionProps();

  return {
    border: '1px solid',
    // filled input
    backgroundColor: 'transparent',
    borderColor: mode('gray.300', 'gray.600')(props),
    ...transitionProps,
    _hover: {
      borderColor: mode('gray.200', 'gray.500')(props),
    },
    _readOnly: {
      boxShadow: 'none !important',
      userSelect: 'all',
    },
    _disabled: {
      opacity: 1,
      backgroundColor: mode('blackAlpha.200', 'whiteAlpha.200')(props),
      borderColor: 'transparent',
      cursor: 'not-allowed',
      _hover: {
        borderColor: 'transparent',
      },
      ':-webkit-autofill': {
        // background color for disabled input which value was selected from browser autocomplete popup
        '-webkit-box-shadow': `0 0 0px 1000px ${ mode('rgba(16, 17, 18, 0.08)', 'rgba(255, 255, 255, 0.08)')(props) } inset`,
      },
    },
    _invalid: {
      borderColor: getColor(theme, errorColor),
      boxShadow: `none`,
    },
    _focusVisible: {
      zIndex: 1,
      borderColor: getColor(theme, focusBorderColor),
      boxShadow: 'md',
    },
    _placeholder: {
      color: mode('blackAlpha.600', 'whiteAlpha.600')(props),
    },
    // not filled input
    ':placeholder-shown:not(:focus-visible):not(:hover):not([aria-invalid=true])': {
      borderColor: borderColor || mode('rgba(230, 230, 231, 1)', 'rgba(66, 66, 68, 1)')(props),
    },

    // not filled input with type="date"
    ':not(:placeholder-shown)[value=""]:not(:focus-visible):not(:hover):not([aria-invalid=true])': {
      borderColor: borderColor || mode('rgba(230, 230, 231, 1)', 'rgba(66, 66, 68, 1)')(props),
      color: 'gray.500',
    },

    ':-webkit-autofill': { transition: 'background-color 5000s ease-in-out 0s' },
    ':-webkit-autofill:hover': { transition: 'background-color 5000s ease-in-out 0s' },
    ':-webkit-autofill:focus': { transition: 'background-color 5000s ease-in-out 0s' },
  };
}
