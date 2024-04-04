import {
  PluginSetupProcessor__factory,
  PluginRepoRegistry,
  PluginSetupProcessor,
} from '../../typechain';
import {ethers} from 'hardhat';

export async function deployPluginSetupProcessor(
  pluginRepoRegistry: PluginRepoRegistry
): Promise<PluginSetupProcessor> {
  let psp: PluginSetupProcessor;

  const PluginSetupProcessor = await ethers.getContractFactory(
    'PluginSetupProcessor'
  );
  // const PluginSetupProcessor = new PluginSetupProcessor__factory(
  //   (await ethers.getSigners())[0]
  // );

  psp = (await PluginSetupProcessor.deploy(
    pluginRepoRegistry.address
  )) as PluginSetupProcessor;

  return psp;
}
