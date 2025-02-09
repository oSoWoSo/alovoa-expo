import React from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from "react-native";

import { useTheme, Text, Button, Menu, Appbar } from "react-native-paper";
import { CardItem } from "../components";
import styles, { STATUS_BAR_HEIGHT } from "../assets/styles";
import * as I18N from "../i18n";
import * as Global from "../Global";
import * as URL from "../URL";
import { DonationDtoListModel, DonationDto } from "../types";
import * as Linking from 'expo-linking';

const Donate = () => {

  const FILTER_RECENT = 1;
  const FILTER_AMOUNT = 2;

  const i18n = I18N.getI18n()
  const { colors } = useTheme();

  const [refreshing, setRefreshing] = React.useState(false);
  const [results, setResults] = React.useState(Array<DonationDto>);
  const [filter, setFilter] = React.useState(FILTER_RECENT);

  const [menuSortVisible, setMenuSortVisible] = React.useState(false);

  const showMenuSort = () => setMenuSortVisible(true);
  const hideMenuSort = () => setMenuSortVisible(false);

  async function load() {
    let response = await Global.Fetch(Global.format(URL.API_DONATE_RECENT, filter));
    let data: DonationDtoListModel = response.data;
    setResults(data.list);
  }

  function updateFilter(num: number) {
    if (num != filter) {
      setFilter(num);
    }
    hideMenuSort();
  }

  React.useEffect(() => {
    load();
  }, [filter]);

  React.useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.containerMatches} >
      <View style={{ paddingTop: STATUS_BAR_HEIGHT }}></View>
      <View style={[styles.top, { paddingBottom: 8, justifyContent: 'flex-end' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Global.FLAG_FDROID &&
            <Button icon="cash-multiple" mode="contained-tonal" onPress={() => Linking.openURL(URL.DONATE_LIST)} style={{ marginRight: 4 }}>
              <Text>{i18n.t('navigation.donate')}</Text>
            </Button>}
          <View>
            <Menu
              visible={menuSortVisible}
              onDismiss={hideMenuSort}
              anchor={<Button icon="sort" mode="contained-tonal" onPress={() => showMenuSort()}>
                <Text>{i18n.t('sort')}</Text>
              </Button>}>
              <Menu.Item leadingIcon="sort-clock-ascending-outline" onPress={() => { updateFilter(FILTER_RECENT) }} title={i18n.t('donate.filter.recent')} />
              <Menu.Item leadingIcon="sort-numeric-descending-variant" onPress={() => { updateFilter(FILTER_AMOUNT) }} title={i18n.t('donate.filter.amount')} />
            </Menu>
          </View>
        </View>
      </View>


      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
        numColumns={2}
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <CardItem
              user={item.user}
              hasActions={false}
              hasVariant
              hasDonation
              donation={item.amount}
            />
          </TouchableOpacity>
        )}
      />


    </View>
  )
};

export default Donate;
