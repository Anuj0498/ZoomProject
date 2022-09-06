import { StyleSheet } from 'react-native';
import Theme from '../Theme';

const GlobalStyles = StyleSheet.create({
  spaceHight: {
    height: Theme.hp('10%'),
  },
  spaceHight1: {
    height: Theme.hp('4%'),
  },
  spaceHight2: {
    height: Theme.hp('3%'),
  },
  spaceHight3: {
    height: Theme.hp('2%'),
  },
  spaceHight4: {
    height: Theme.hp('1%'),
  },
  spaceHight5: {
    height: Theme.hp('0.5%'),
  },
  spaceHight6: {
    height: Theme.hp('7%'),
  },
  row: {
    flexDirection: Theme.row,
  },
  rowCenter: {
    flexDirection: Theme.row,
    alignSelf: Theme.align,
  },
  rowSpace: {
    flexDirection: Theme.row,
    justifyContent: Theme.spaceBetween,
  },
  rowAround: {
    flexDirection: Theme.row,
    justifyContent: Theme.spaceAround,
  },
  rowEvenly: {
    flexDirection: Theme.row,
    justifyContent: Theme.spaceEvenly,
  },
  column: {
    flexDirection: Theme.column,
  },
  spaceWidth: {
    width: Theme.wp('10%'),
  },
  spaceWidth1: {
    width: Theme.wp('5%'),
  },
  spaceWidth2: {
    width: Theme.wp('4%'),
  },
  spaceWidth3: {
    width: Theme.wp('3%'),
  },
  spaceWidth4: {
    width: Theme.wp('2%'),
  },
  spaceWidth5: {
    width: Theme.wp('1%'),
  },
  wrapInner: {
    width: Theme.wp('80%'),
    alignSelf: Theme.align,
  },
  divider: {
    width: Theme.wp('80%'),
    height: 1,
    backgroundColor: Theme.placeholderCol,
    alignSelf: Theme.align,
  },
  divider1: {
    width: Theme.wp('65%'),
    height: 1,
    backgroundColor: Theme.placeholderCol,
    alignSelf: Theme.align,
    marginTop: '6%',
    marginBottom: '6%',
  },
  center: {
    alignSelf: Theme.align,
    width: Theme.wp('100%'),
  },
  centerInner: {
    alignSelf: Theme.align,
    width: Theme.wp('80%'),
  },
  centerInner: {
    alignSelf: Theme.align,
    width: Theme.wp('80%'),
  },
  centerInner: {
    alignSelf: Theme.align,
    width: Theme.wp('80%'),
  },
  centerInner: {
    alignSelf: Theme.align,
    width: Theme.wp('80%'),
  },
  centerInner: {
    alignSelf: Theme.align,
    width: Theme.wp('80%'),
  },
  centerInner: {
    alignSelf: Theme.align,
    width: Theme.wp('80%'),
  },
  centerInner: {
    alignSelf: Theme.align,
    width: Theme.wp('80%'),
  },
  placeholderColor: {
    color: Theme.placeholderCol,
  },
  textNormal: {
    textAlign: Theme.align,
    fontFamily: Theme.Roboto,
    fontSize: Theme.txtMedium,
    color: Theme.txtBlue,
  },
  textLarge: {
    textAlign: Theme.align,
    fontFamily: Theme.Roboto,
    fontSize: Theme.txtMedium2,
    color: Theme.txtBlue,
  },
  textMedium: {
    textAlign: Theme.align,
    fontFamily: Theme.Roboto,
    fontSize: Theme.txtMedium,
    color: Theme.txtBlue,
  },
  textSmall: {
    textAlign: Theme.align,
    fontFamily: Theme.Roboto,
    fontSize: Theme.txtSmall,
    color: Theme.txtBlue,
  },
});
export default GlobalStyles;
